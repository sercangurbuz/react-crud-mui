import { DeepPartial, FieldValues } from 'react-hook-form';

import { TableState } from '@tanstack/react-table';

import { UseFormReturn } from '../../form/hooks/useForm';
import useFormInitEffect from '../../form/hooks/useFormInitEffect';
import { TabChangedPayload } from '../../page/components/DefaultTabs';
import useSettings from '../../settings-provider/hooks/useSettings';
import { TableProps } from '../../table/Table';
import { DEFAULT_PAGEINDEX } from '../constants';
import ListPageContent, { ListPageContentProps } from './ListPageContent';

/* -------------------------------------------------------------------------- */
/*                                    Types                                   */
/* -------------------------------------------------------------------------- */

export interface PagingListModel<TModel> {
  data: TModel[];
  dataCount: number;
}
export type ListPageModel<TModel> = PagingListModel<TModel>;
export type ListPageMeta = Pick<TableState, 'pagination' | 'sorting' | 'columnFilters'> &
  TabChangedPayload & {
    reason: SearchReason;
  };
export type SearchReason =
  | 'search'
  | 'sorting'
  | 'pagination'
  | 'init'
  | 'clear'
  | 'export'
  | 'tabChanged'
  | 'columnfilter';

export type ListPageFilter<TFilter extends FieldValues> = TFilter & { _meta: ListPageMeta };

export type NeedDataPayload<TFilter extends FieldValues> = {
  filter: ListPageFilter<TFilter>;
};

export interface ListPageFilterProps<
  TModel extends FieldValues,
  TFilter extends FieldValues = FieldValues,
  TDetailPageModel extends FieldValues = FieldValues,
> extends Omit<
    ListPageContentProps<TModel, TDetailPageModel>,
    'onSearch' | 'onExcelExport' | 'tableProps' | 'onTabChanged'
  > {
  /**
   * Table states as partial for providing extra props to table
   */
  tableProps?: Partial<TableProps<TModel>>;
  /**
   * RHF instance
   */
  form: UseFormReturn<TFilter>;
  /**
   * Form filter values change event
   */
  onChange?: (filter: TFilter, meta?: DeepPartial<ListPageMeta>) => void;
  /**
   * Default index of tab
   */
  defaultSegmentIndex?: number;
  /**
   * Meta data of listpage
   */
  meta: ListPageMeta;
  /**
   * Meta data of listpage
   */
  defaultMeta?: DeepPartial<ListPageMeta>;
}

function ListPageFilter<
  TModel extends FieldValues,
  TFilter extends FieldValues = FieldValues,
  TDetailPageModel extends FieldValues = FieldValues,
>(props: ListPageFilterProps<TModel, TFilter, TDetailPageModel>) {
  const { form, meta, tableProps: extableProps, onChange, defaultSegmentIndex, onClear } = props;

  const {
    reset,
    formState: { defaultValues },
    getFormModel,
  } = form;

  /* -------------------------------------------------------------------------- */
  /*                                    Hooks                                   */
  /* -------------------------------------------------------------------------- */

  const { pageSize: defaultPageSize } = useSettings();

  /* -------------------------------------------------------------------------- */
  /*                                 Table Props                                */
  /* -------------------------------------------------------------------------- */

  const tableProps = {
    enableSorting: true,
    enablePaging: true,
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
    // setters
    onColumnFiltersChange: (updater) => {
      const columnFilters = updater instanceof Function ? updater(meta.columnFilters) : updater;
      void handleSearch({ columnFilters, reason: 'columnfilter' } as DeepPartial<ListPageMeta>);
    },
    onPaginationChange: (updater) => {
      const pagination = updater instanceof Function ? updater(meta.pagination) : updater;
      void handleSearch({ pagination, reason: 'pagination' });
    },
    onSortingChange: (updater) => {
      const sorting = updater instanceof Function ? updater(meta.sorting) : updater;
      void handleSearch({ sorting, reason: 'sorting' });
    },
    ...extableProps,
    // states
    state: {
      pagination: meta?.pagination,
      sorting: meta?.sorting,
      columnFilters: meta?.columnFilters,
      ...extableProps?.state,
    },
  } as TableProps<TModel>;

  /* -------------------------------------------------------------------------- */
  /*                                   Events                                   */
  /* -------------------------------------------------------------------------- */

  /**
   * Get current form filter and update filter state
   */
  const handleSearch = async (meta?: DeepPartial<ListPageMeta>) => {
    try {
      // validate and get current filter from form
      const values = await getFormModel();
      onChange?.(values, meta);
    } catch {
      /* empty */
    }
  };

  const clearForm = () => {
    // reset form filters
    reset(defaultValues as TFilter, { keepDefaultValues: true });
    // reset form values
    void handleSearch({
      ...extableProps?.initialState,
      segmentIndex: defaultSegmentIndex,
      pagination: {
        pageIndex: DEFAULT_PAGEINDEX,
        pageSize: defaultPageSize,
        ...extableProps?.initialState?.pagination,
      },
    } as DeepPartial<ListPageMeta>);
    // clear callback
    onClear?.();
  };

  /**
   * Wait RHF to init (skip to second render)
   */
  useFormInitEffect(() => {
    void handleSearch({ reason: 'init' });
  });

  /* --------------------------------- Render --------------------------------- */

  return (
    <ListPageContent<TModel, TDetailPageModel>
      {...props}
      onSearch={() =>
        void handleSearch({
          reason: 'search',
          pagination: {
            pageIndex: DEFAULT_PAGEINDEX,
          },
        })
      }
      tableProps={tableProps}
      activeSegmentIndex={meta?.selectedTabIndex}
      onTabChanged={(payload) => {
        void handleSearch({ reason: 'tabChanged', ...payload });
      }}
      onClear={clearForm}
    />
  );
}

export default ListPageFilter;
