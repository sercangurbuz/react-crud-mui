import { useMemo, useState } from 'react';
import { FieldValues } from 'react-hook-form';

import {
  ColumnFiltersState,
  PaginationState,
  SortingState,
  TableOptions,
  TableState,
} from '@tanstack/react-table';

import useSettings from '../../settings-provider/hooks/useSettings';
import { INITIAL_PAGEINDEX } from '../constants';
import { ListPageFilter } from '../pages/ListPageData';

export type DefaultTableState = Partial<
  Pick<TableState, 'pagination' | 'sorting' | 'columnFilters'>
>;
export type DefaultTableStateSetters = Partial<
  Pick<TableOptions<unknown>, 'onPaginationChange' | 'onSortingChange' | 'onColumnFiltersChange'>
>;

interface UseListPageTableStatesOptions<TFilter extends FieldValues> {
  /**
   * External filter criteries
   */
  defaultFilter?: ListPageFilter<TFilter>;
  /**
   * Table initial states
   */
  defaultTableStates?: DefaultTableState;
}

function useListPageTableStates<TFilter extends FieldValues>({
  defaultFilter,
  defaultTableStates,
}: UseListPageTableStatesOptions<TFilter>) {
  /* -------------------------------------------------------------------------- */
  /*                                    Hooks                                   */
  /* -------------------------------------------------------------------------- */
  const { pageSize: defaultPageSize } = useSettings();

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
      ...defaultTableStates?.pagination,
      ...paginationFromFilter,
    };
  });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnsFilters, setColumnFilter] = useState<ColumnFiltersState>([]);

  const states = useMemo<DefaultTableState>(
    () => ({
      pagination,
      sorting,
      columnsFilters,
    }),
    [pagination, sorting, columnsFilters],
  );

  const setters = useMemo<DefaultTableStateSetters>(
    () => ({
      onColumnFiltersChange: setColumnFilter,
      onPaginationChange: setPagination,
      onSortingChange: setSorting,
    }),
    [],
  );

  return [states, setters] as const;
}

export default useListPageTableStates;
