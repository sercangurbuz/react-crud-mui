/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback } from 'react';

import dayjs from 'dayjs';

export interface UseURLSearchFilterOptions<TFilter> {
  enableQueryStringFilter?: boolean | FilterSource<TFilter>;
  params?: URLSearchParams;
}

/* -------------------------------------------------------------------------- */
/*                                    Types                                   */
/* -------------------------------------------------------------------------- */
export type AdvancedFilterSource = {
  type: 'number' | 'string' | 'date';
  isArray?: boolean;
};
export type FilterSource<TFilter> = Partial<Record<keyof TFilter, boolean | AdvancedFilterSource>>;

function useURLSearchFilter<TFilter>({
  enableQueryStringFilter,
  params,
}: UseURLSearchFilterOptions<TFilter>) {
  /* -------------------------------------------------------------------------- */
  /*                                    Hooks                                   */
  /* -------------------------------------------------------------------------- */
  const getFiltersInQS = useCallback(() => {
    let newFields: TFilter | undefined;

    if (enableQueryStringFilter && params) {
      newFields = {} as TFilter;

      if (enableQueryStringFilter === true) {
        return Object.fromEntries(params.entries()) as TFilter;
      }

      //iterate filters to extract value
      for (const field in enableQueryStringFilter) {
        let filterValue;
        //advanced object to define type
        if (typeof enableQueryStringFilter[field] === 'object') {
          const { type, isArray } = enableQueryStringFilter[field];

          //extract value
          const value = params?.get(field);

          //exit if value is falsy
          if (value === null || value === undefined) {
            continue;
          }

          switch (type) {
            case 'number':
              if (Array.isArray(value) || isArray) {
                filterValue = []
                  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                  .concat(value as any)
                  .map(Number)
                  .filter((v) => !isNaN(v));
                // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
              } else if (!isNaN(value as any)) {
                filterValue = Number(value);
              }
              break;
            case 'date':
              if (Array.isArray(value) || isArray) {
                filterValue = []
                  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                  .concat(value as any)
                  .map((d) => dayjs(d))
                  .filter((m) => m.isValid());
              } else {
                const dateValue = dayjs(value);
                filterValue = dateValue.isValid() ? dateValue : undefined;
              }
              break;
            default:
              filterValue = value;
              break;
          }
        } else {
          if (enableQueryStringFilter[field] === false) {
            continue;
          }

          filterValue = params?.get(field);
        }

        if (filterValue !== null && filterValue !== undefined) {
          newFields[field] = filterValue as TFilter[Extract<keyof TFilter, string>];
        }
      }
    }

    return newFields;
  }, [enableQueryStringFilter, params]);

  return getFiltersInQS;
}

export default useURLSearchFilter;
