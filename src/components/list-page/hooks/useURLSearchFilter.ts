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

  const [currentSearchParams, setSearchParams] = useSearchParams();
  const { search } = useLocation();

  const getFiltersInQS = useCallback(
    ({ whiteList }: { whiteList?: string[] } = {}) => {
      const {
        page,
        size,
        sorting = [],
        ...filter
      } = qs.parse(search, {
        ignoreQueryPrefix: true,
        decoder(value) {
          if (/^(\d+|\d*\.\d+)$/.test(value)) {
            return parseFloat(value);
          }

          const keywords: Record<string, unknown> = {
            true: true,
            false: false,
            null: null,
            // eslint-disable-next-line object-shorthand
            undefined: undefined,
          };
          if (value in keywords) {
            return keywords[value];
          }

          return value;
        },
      });

      let allowedFilters = filter;
      if (whiteList) {
        allowedFilters = whiteList
          .filter({}.hasOwnProperty.bind(filter))
          .reduce((r, c) => Object.assign(r, { [c]: filter[c] }), {});
      }

      return {
        filter: allowedFilters,
        meta: {
          pagination: {
            pageIndex: page ? Number(page) : DEFAULT_PAGEINDEX,
            pageSize: size ? Number(size) : DEFAULT_PAGESIZE,
          },
          sorting,
        },
      };
    },
    [search],
  );

  const setFiltersInQS = useCallback(
    (filter: TFilter, _meta: ListPageMeta) => {
      const currentParams = Object.fromEntries(currentSearchParams.entries());
      const qsParams = {
        ...currentParams,
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
    [currentSearchParams, setSearchParams],
  );

  return { getFiltersInQS, setFiltersInQS };
}

export default useURLSearchFilter;
