import { DeepPartial, FieldValues } from 'react-hook-form';

import { TableState } from '@tanstack/react-table';

import { UseFormReturn } from '../../form/hooks/useForm';
import useFormInitEffect from '../../form/hooks/useFormInitEffect';
import { TabChangedPayload } from '../../page/components/DefaultTabs';
import { TableProps } from '../../table/Table';
import { DEFAULT_PAGEINDEX, DEFAULT_PAGESIZE } from '../constants';
import ListPageContent, { ListPageContentProps } from './ListPageContent';

/* -------------------------------------------------------------------------- */
/*                                    Types                                   */
/* -------------------------------------------------------------------------- */

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
  onChange?: (filter: TFilter, meta: DeepPartial<ListPageMeta>) => void;
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
  /**
   * Make search on mount,default true
   */
  searchOnLoad?: boolean;
}

/**
 * ListPage with filtering features
 */
function ListPageFilter<
  TModel extends FieldValues,
  TFilter extends FieldValues = FieldValues,
  TDetailPageModel extends FieldValues = FieldValues,
>({
  form,
  meta,
  tableProps: extableProps,
  onChange,
  defaultSegmentIndex,
  enablePagination = true,
  onClear,
  defaultMeta,
  searchOnLoad = true,
  ...lpProps
}: ListPageFilterProps<TModel, TFilter, TDetailPageModel>) {
  const {
    reset,
    formState: { defaultValues },
    getFormModel,
  } = form;

  /* -------------------------------------------------------------------------- */
  /*                                 Table Props                                */
  /* -------------------------------------------------------------------------- */

  const tableProps = {
    enableSorting: true,
    enablePagination,
    // default server base pagination is enabled
    manualPagination: enablePagination,
    // default server base sorting is enabled
    manualSorting: true,
    manualFiltering: true,
    // setters
    onColumnFiltersChange: (updater) => {
      const columnFilters = updater instanceof Function ? updater(meta.columnFilters) : updater;
      void handleSearch({ columnFilters, reason: 'columnfilter' } as DeepPartial<ListPageMeta>);
    },
    ...(enablePagination
      ? {
          onPaginationChange: (updater) => {
            const pagination = updater instanceof Function ? updater(meta.pagination) : updater;
            void handleSearch({ pagination, reason: 'pagination' });
          },
        }
      : undefined),
    onSortingChange: (updater) => {
      const sorting = updater instanceof Function ? updater(meta.sorting) : updater;
      void handleSearch({ sorting, reason: 'sorting' });
    },
    ...extableProps,
    // states
    state: {
      ...(enablePagination ? { pagination: meta?.pagination } : undefined),
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
  const handleSearch = async (meta: DeepPartial<ListPageMeta>) => {
    try {
      // validate and get current filter from form
      const values = await getFormModel();
      onChange?.(values, meta);
    } catch {
      /* empty */
    }
  };

  const clearForm = () => {
    reset(defaultValues as TFilter, { keepDefaultValues: true });
    void handleSearch({
      ...defaultMeta,
      selectedTabIndex: defaultSegmentIndex,
      pagination: {
        pageIndex: DEFAULT_PAGEINDEX,
        pageSize: DEFAULT_PAGESIZE,
        ...defaultMeta?.pagination,
      },
      reason: 'clear',
    });

    onClear?.();
  };

  /**
   * Wait RHF to init to call search on load
   */
  useFormInitEffect(() => {
    if (searchOnLoad) {
      void handleSearch({ reason: 'init' });
    }
  });

  /* --------------------------------- Render --------------------------------- */

  return (
    <ListPageContent<TModel, TDetailPageModel>
      {...lpProps}
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
