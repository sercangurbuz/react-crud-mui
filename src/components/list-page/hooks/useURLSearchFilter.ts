import { useCallback } from 'react';
import { FieldValues } from 'react-hook-form';
import { useSearchParams } from 'react-router-dom';

import removeFalsy from '../../misc/removeFalsy';
import { INITIAL_PAGEINDEX } from '../constants';
import { ListPageMeta } from '../pages/ListPageFilter';

/* -------------------------------------------------------------------------- */
/*                                    Types                                   */
/* -------------------------------------------------------------------------- */
export type QueryStringFilters<TFilter extends FieldValues> = [
  Partial<TFilter> | undefined,
  Partial<ListPageMeta> | undefined,
];

function useURLSearchFilter<TFilter extends FieldValues>() {
  /* -------------------------------------------------------------------------- */
  /*                                    Hooks                                   */
  /* -------------------------------------------------------------------------- */

  const [params, setSearchParams] = useSearchParams();

  const getFiltersInQS = useCallback(() => {
    const { page, size, ...filter } = Object.fromEntries(params.entries());
    return [
      filter,
      {
        pagination: {
          pageIndex: page ? Number(page) : undefined,
          pageSize: size ? Number(size) : undefined,
        },
      },
    ] as QueryStringFilters<TFilter>;
  }, [params]);

  const setFiltersInQS = useCallback(
    (filter: TFilter, _meta: ListPageMeta) => {
      const qsParams = {
        ...filter,
        page: _meta.pagination.pageIndex,
        size: _meta.pagination.pageSize,
      };

      setSearchParams(new URLSearchParams(removeFalsy(qsParams)));
    },
    [setSearchParams],
  );

  return { getFiltersInQS, setFiltersInQS };
}

export default useURLSearchFilter;
