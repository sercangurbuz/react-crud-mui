import { DeepPartial, FieldValues } from 'react-hook-form';

import { getPaginationRowModel, getSortedRowModel, TableState } from '@tanstack/react-table';

import { UseFormReturn } from '../../form/hooks/useForm';
import useFormInitEffect from '../../form/hooks/useFormInitEffect';
import { TabChangedPayload } from '../../page/components/DefaultTabs';
import { TableProps } from '../../table/Table';
import { CardListProps } from '../components/CardList';
import { DEFAULT_PAGEINDEX, DEFAULT_PAGESIZE } from '../constants';
import ListPageContent, { ListPageContentProps } from './ListPageContent';

/* -------------------------------------------------------------------------- */
/*                                    Types                                   */
/* -------------------------------------------------------------------------- */

export type TableMode = 'server' | 'client';

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
> extends Omit<
    ListPageContentProps<TModel>,
    'onSearch' | 'onExcelExport' | 'tableProps' | 'onTabChanged' | 'cardProps'
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
  /**
   * Table sorting and
   */
  tableMode?: TableMode;
  /**
   * Enable table pagination default true
   */
  enablePagination?: boolean;
  /**
   * Enable table sorting default true
   */
  enableSorting?: boolean;

  cardProps?: Pick<
    CardListProps<TModel>,
    'cardColProps' | 'cardRowProps' | 'onCardMeta' | 'emptyTextProps'
  >;
}

/**
 * ListPage with filtering features
 */
function ListPageFilter<TModel extends FieldValues, TFilter extends FieldValues = FieldValues>({
  cardProps,
  data,
  dataCount,
  defaultMeta,
  defaultSegmentIndex,
  enablePagination = true,
  enableSorting = true,
  form,
  meta,
  onChange,
  onClear,
  searchOnLoad = true,
  tableMode,
  tableProps: extableProps,
  ...lpProps
}: ListPageFilterProps<TModel, TFilter>) {
  const {
    reset,
    formState: { defaultValues, isLoading: isDefaultValuesLoading },
    getFormModel,
  } = form;

  /* -------------------------------------------------------------------------- */
  /*                                 Table Props                                */
  /* -------------------------------------------------------------------------- */

  const tableProps = {
    enableSorting,
    enablePagination,
    manualPagination: enablePagination && tableMode === 'server',
    manualSorting: tableMode === 'server',
    manualFiltering: tableMode === 'server',
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
          ...(tableMode === 'client'
            ? { getPaginationRowModel: getPaginationRowModel() }
            : undefined),
        }
      : undefined),
    ...(enableSorting
      ? {
          onSortingChange: (updater) => {
            const sorting = updater instanceof Function ? updater(meta.sorting) : updater;
            void handleSearch({ sorting, reason: 'sorting' });
          },
          ...(tableMode === 'client' ? { getSortedRowModel: getSortedRowModel() } : undefined),
        }
      : undefined),
    ...extableProps,
    // states
    state: {
      ...(enablePagination ? { pagination: meta?.pagination } : undefined),
      ...(enableSorting ? { sorting: meta?.sorting } : undefined),
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
    if (searchOnLoad && !isDefaultValuesLoading) {
      void handleSearch({ reason: 'init' });
    }
  }, [isDefaultValuesLoading]);

  /* --------------------------------- Render --------------------------------- */

  return (
    <ListPageContent<TModel>
      {...lpProps}
      data={data}
      dataCount={dataCount}
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
      cardProps={
        {
          enablePagination,
          paginationProps: {
            count: Math.ceil((dataCount ?? data?.length ?? 0) / meta?.pagination?.pageSize),
            onChange(_event, page) {
              void handleSearch({
                pagination: {
                  pageIndex: page - 1,
                },
                reason: 'pagination',
              });
            },
          },
          ...cardProps,
        } as CardListProps<TModel>
      }
    />
  );
}

export default ListPageFilter;
