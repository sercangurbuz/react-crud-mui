import { useMemo, useState } from 'react';
import { FieldValues } from 'react-hook-form';

import {
  ColumnFiltersState,
  InitialTableState,
  PaginationState,
  RowSelectionState,
  SortingState,
  TableOptions,
  TableState,
} from '@tanstack/react-table';

import useSettings from '../../settings-provider/hooks/useSettings';
import { INITIAL_PAGEINDEX } from '../constants';
import { ListPageFilter } from '../pages/ListPageData';

export type DefaultTableState = Partial<
  Pick<TableState, 'pagination' | 'sorting' | 'columnFilters' | 'rowSelection'>
>;
export type DefaultTableStateSetters = Partial<
  Pick<
    TableOptions<unknown>,
    'onPaginationChange' | 'onSortingChange' | 'onColumnFiltersChange' | 'onRowSelectionChange'
  >
>;

interface UseListPageTableStatesOptions<TFilter extends FieldValues> {
  /**
   * External filter criteries
   */
  defaultFilter?: ListPageFilter<TFilter>;
  /**
   * Table initial states
   */
  initialState?: InitialTableState;
}

function useListPageTableProps<TFilter extends FieldValues, TModel extends FieldValues>({
  defaultFilter,
  initialState,
}: UseListPageTableStatesOptions<TFilter>) {
  /* -------------------------------------------------------------------------- */
  /*                                    Hooks                                   */
  /* -------------------------------------------------------------------------- */

  const { pageSize: defaultPageSize } = useSettings();

  /* --------------------------------- States --------------------------------- */

  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [pagination, setPagination] = useState<PaginationState>(() => {
    let defaultPagination: PaginationState = {
      pageIndex: INITIAL_PAGEINDEX,
      pageSize: defaultPageSize,
    };

    let paginationFromFilter: PaginationState | undefined = undefined;
    if (defaultFilter) {
      ({ pagination: paginationFromFilter } = defaultFilter);
    }

    return {
      ...defaultPagination,
      ...initialState?.pagination,
      ...paginationFromFilter,
    };
  });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilter] = useState<ColumnFiltersState>([]);

  const props = useMemo<Partial<TableOptions<TModel>>>(
    () => ({
      state: { pagination, sorting, columnFilters, rowSelection },
      enableSorting: true,
      manualPagination: true,
      enableRowSelection: true,
      manualSorting: true,
      manualFiltering: true,
      // setters
      onColumnFiltersChange: setColumnFilter,
      onPaginationChange: setPagination,
      onSortingChange: setSorting,
      onRowSelectionChange: setRowSelection,
    }),
    [pagination, sorting, columnFilters, rowSelection],
  );

  return props as TableOptions<TModel>;
}

export default useListPageTableProps;
