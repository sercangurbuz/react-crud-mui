import { useState } from 'react';

import {
  ColumnFiltersState,
  PaginationState,
  RowSelectionState,
  SortingState,
  TableOptions,
  TableState,
} from '@tanstack/react-table';

import { DEFAULT_PAGESIZE, INITIAL_PAGEINDEX } from '../constants';

/* -------------------------------------------------------------------------- */
/*                                    Types                                   */
/* -------------------------------------------------------------------------- */

export type SimpleTableStates = Pick<
  TableState,
  'columnFilters' | 'pagination' | 'sorting' | 'rowSelection'
>;

export type SimpleTableStateSetters = Pick<
  TableOptions<unknown>,
  'onColumnFiltersChange' | 'onSortingChange' | 'onPaginationChange' | 'onRowSelectionChange'
>;

export type UseSimpleTableStatesReturn = [SimpleTableStates, SimpleTableStateSetters];

function useSimpleTableStates(defaultStates?: Partial<SimpleTableStates>) {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>(
    defaultStates?.rowSelection ?? {},
  );
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
    defaultStates?.columnFilters ?? [],
  );
  const [sorting, setSorting] = useState<SortingState>(defaultStates?.sorting ?? []);
  const [pagination, setPagination] = useState<PaginationState>(
    defaultStates?.pagination ?? { pageIndex: INITIAL_PAGEINDEX, pageSize: DEFAULT_PAGESIZE },
  );

  return [
    { columnFilters, pagination, rowSelection, sorting },
    {
      onColumnFiltersChange: setColumnFilters,
      onPaginationChange: setPagination,
      onSortingChange: setSorting,
      onRowSelectionChange: setRowSelection,
    },
  ] as UseSimpleTableStatesReturn;
}

export default useSimpleTableStates;
