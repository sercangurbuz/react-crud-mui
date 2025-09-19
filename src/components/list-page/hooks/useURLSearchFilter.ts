import { useCallback, useMemo } from 'react';
import { FieldValues } from 'react-hook-form';
import { useSearchParams } from 'react-router-dom';

import qs from 'qs';

import useSettings from '../../crud-mui-provider/hooks/useSettings';
import { DEFAULT_PAGEINDEX, DEFAULT_PAGESIZE } from '../constants';
import { ListPageMeta } from '../pages/ListPageFilter';

/* -------------------------------------------------------------------------- */
/*                                    Types                                   */
/* -------------------------------------------------------------------------- */

export type MatchFields<TFilter extends FieldValues> = {
  [k in keyof TFilter]?: true;
};

type UseURLSearchFilterOptions<TFilter extends FieldValues> = {
  matcher?: MatchFields<TFilter>;
};
function useURLSearchFilter<TFilter extends FieldValues>({
  matcher,
}: UseURLSearchFilterOptions<TFilter>) {
  /* -------------------------------------------------------------------------- */
  /*                                    Hooks                                   */
  /* -------------------------------------------------------------------------- */

  const { segmentParamName } = useSettings();
  const [searchParams, setSearchParams] = useSearchParams();

  const search = useMemo(() => {
    if (matcher) {
      const params = new URLSearchParams();
      searchParams.forEach((value, key) => {
        if (key in matcher) {
          params.append(key, value);
        }
      });
      return params.toString();
    }

    return searchParams.toString();
  }, [searchParams, matcher]);

  const getFiltersInQS = useCallback(() => {
    const {
      page,
      size,
      sorting = [],
      [segmentParamName]: selectedTabIndex,
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

    return {
      filter,
      meta: {
        pagination: {
          pageIndex: page ? Number(page) : DEFAULT_PAGEINDEX,
          pageSize: size ? Number(size) : DEFAULT_PAGESIZE,
        },
        sorting,
        selectedTabIndex,
      },
    };
  }, [search, segmentParamName]);

  const setFiltersInQS = useCallback(
    (filter: TFilter, meta: ListPageMeta, extraFilter?: Record<string, unknown>) => {
      const qsParams = {
        ...filter,
        ...extraFilter,
        page: meta.pagination.pageIndex,
        size: meta.pagination.pageSize,
        sorting: meta.sorting,
      };

      const filterQs = qs.stringify(qsParams, {
        skipNulls: true,
        strictNullHandling: true,
        charset: 'utf-8',
        filter(prefix, value) {
          if (matcher && prefix && !(prefix in matcher)) {
            return;
          }

          if (prefix === 'page' && value === DEFAULT_PAGEINDEX) {
            return;
          }
          if (prefix === 'size' && value === DEFAULT_PAGESIZE) {
            return;
          }

          return value;
        },
      });

      setSearchParams(filterQs);
    },
    [setSearchParams, matcher],
  );

  return { getFiltersInQS, setFiltersInQS };
}

export default useURLSearchFilter;
