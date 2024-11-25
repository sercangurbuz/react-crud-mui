import { useCallback } from 'react';
import { FieldValues } from 'react-hook-form';
import { useLocation, useSearchParams } from 'react-router-dom';

import qs from 'qs';

import { DEFAULT_PAGEINDEX, DEFAULT_PAGESIZE } from '../constants';
import { ListPageMeta } from '../pages/ListPageFilter';

/* -------------------------------------------------------------------------- */
/*                                    Types                                   */
/* -------------------------------------------------------------------------- */

function useURLSearchFilter<TFilter extends FieldValues>() {
  /* -------------------------------------------------------------------------- */
  /*                                    Hooks                                   */
  /* -------------------------------------------------------------------------- */

  const [, setSearchParams] = useSearchParams();
  const { search } = useLocation();

  const getFiltersInQS = useCallback(() => {
    const {
      page,
      size,
      sorting = [],
      ...filter
    } = qs.parse(search, {
      ignoreQueryPrefix: true,
    });
    return {
      filter,
      meta: {
        pagination: {
          pageIndex: page ? Number(page) : DEFAULT_PAGEINDEX,
          pageSize: size ? Number(size) : DEFAULT_PAGESIZE,
        },
        sorting,
      },
    };
  }, [search]);

  const setFiltersInQS = useCallback(
    (filter: TFilter, _meta: ListPageMeta) => {
      const qsParams = {
        ...filter,
        page: _meta.pagination.pageIndex,
        size: _meta.pagination.pageSize,
        sorting: _meta.sorting,
      };

      const filterQs = qs.stringify(qsParams, {
        skipNulls: true,
        strictNullHandling: true,
        filter(prefix, value) {
          if (prefix === 'page' && value === DEFAULT_PAGEINDEX) {
            return;
          }
          if (prefix === 'size' && value === DEFAULT_PAGESIZE) {
            return;
          }

          if (value === '') {
            return;
          }
          // eslint-disable-next-line @typescript-eslint/no-unsafe-return
          return value;
        },
      });

      setSearchParams(filterQs);
    },
    [setSearchParams],
  );

  return { getFiltersInQS, setFiltersInQS };
}

export default useURLSearchFilter;
