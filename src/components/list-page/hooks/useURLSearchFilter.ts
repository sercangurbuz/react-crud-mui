import { FieldValues, get } from 'react-hook-form';
import { useLocation, useSearchParams } from 'react-router-dom';

import qs from 'qs';

import useSettings from '../../crud-mui-provider/hooks/useSettings';
import { DEFAULT_PAGEINDEX, DEFAULT_PAGESIZE } from '../constants';
import { ListPageMeta } from '../pages/ListPageFilter';

/* -------------------------------------------------------------------------- */
/*                                    Types                                   */
/* -------------------------------------------------------------------------- */

type UseURLSearchFilterOptions = {
  defaultValues?: Record<string, unknown>;
};
function useURLSearchFilter<TFilter extends FieldValues>({
  defaultValues,
}: UseURLSearchFilterOptions) {
  /* -------------------------------------------------------------------------- */
  /*                                    Hooks                                   */
  /* -------------------------------------------------------------------------- */

  const { segmentParamName } = useSettings();
  const [, setSearchParams] = useSearchParams();
  const { search } = useLocation();

  const getFiltersInQS = () => {
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
  };

  const setFiltersInQS = (
    filter: TFilter,
    meta: ListPageMeta,
    extraFilter?: Record<string, unknown>,
  ) => {
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
        if (prefix === 'page' && value === DEFAULT_PAGEINDEX) {
          return;
        }
        if (prefix === 'size' && value === DEFAULT_PAGESIZE) {
          return;
        }

        if (value === '' || get(defaultValues, prefix) === value) {
          return;
        }
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return value;
      },
    });

    setSearchParams(filterQs);
  };

  return { getFiltersInQS, setFiltersInQS };
}

export default useURLSearchFilter;
