import { useState } from 'react';
import { FieldValues, get } from 'react-hook-form';
import { Outlet, useNavigate, useSearchParams } from 'react-router-dom';

import useSegmentParams, {
  UseSegmentParamsOptions,
} from '../../detail-page/hooks/useSegmentParams';
import flattenObject from '../../misc/flattenObject';
import isNil from '../../misc/isNil';
import useSettings from '../../settings-provider/hooks/useSettings';
import useURLSearchFilter, { UseURLSearchFilterOptions } from '../hooks/useURLSearchFilter';
import ListPage, { ListPageProps } from './ListPage';
import { ListPageFilter } from './ListPageFilter';

export interface ListPageRouteProps<
  TModel extends FieldValues,
  TFilter extends FieldValues = FieldValues,
  TDetailPageModel extends FieldValues = FieldValues,
> extends ListPageProps<TModel, TFilter, TDetailPageModel>,
    Omit<UseSegmentParamsOptions, 'paths' | 'enableSegmentRouting'> {
  enableQueryStringFilter?: UseURLSearchFilterOptions<TFilter>['enableQueryStringFilter'];
}

function ListPageRoute<
  TModel extends FieldValues,
  TFilter extends FieldValues = FieldValues,
  TDetailPageModel extends FieldValues = FieldValues,
>({
  enableQueryStringFilter = false,
  enableNestedSegments,
  fallbackSegmentIndex,
  defaultFilter,
  tabs,
  onNeedData,
  ...listPageProps
}: ListPageRouteProps<TModel, TFilter, TDetailPageModel>) {
  /* -------------------------------------------------------------------------- */
  /*                                    Hooks                                   */
  /* -------------------------------------------------------------------------- */

  const { newItemParamValue } = useSettings();
  const navigate = useNavigate();
  const [currentQueryParameters, setSearchParams] = useSearchParams();
  const isReadonly = currentQueryParameters.has('readonly');

  /* -------------------------------------------------------------------------- */
  /*                                   Filter                                   */
  /* -------------------------------------------------------------------------- */

  /**
   * Listpage can be used as a nested segment
   */
  const [segment, setSegment] = useSegmentParams({
    enableNestedSegments,
    fallbackSegmentIndex,
    paths: tabs,
  });

  const getFiltersInQS = useURLSearchFilter<ListPageFilter<TFilter>>({
    enableQueryStringFilter,
    params: currentQueryParameters,
  });

  const [filtersInQS] = useState(() =>
    enableQueryStringFilter ? getFiltersInQS() : defaultFilter,
  );

  /* -------------------------------------------------------------------------- */
  /*                                   Events                                   */
  /* -------------------------------------------------------------------------- */

  const setQSByFilter = (filter: Omit<ListPageFilter<TFilter>, '_meta'>) => {
    let flattenedFilter = flattenObject(filter);

    if (flattenedFilter) {
      if (typeof enableQueryStringFilter === 'object') {
        flattenedFilter = Object.fromEntries(
          Object.keys(enableQueryStringFilter)
            .map((key) => [key, get(flattenedFilter, key) as string])
            .filter(([, value]) => !isNil(value)),
        );
      }

      setSearchParams(new URLSearchParams(flattenedFilter));
    }
  };

  const handleNeedData = (filter: ListPageFilter<TFilter> | undefined) => {
    if (enableQueryStringFilter && filter) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { _meta, ...formValues } = filter;
      setQSByFilter(formValues);
    }

    if (filter?._meta?.reason === 'tabChanged') {
      setSegment(filter?._meta.segmentIndex);

      if (enableNestedSegments) {
        return;
      }
    }

    onNeedData?.(filter);
  };

  const handleNewItem = () => {
    const pathname = `./${newItemParamValue}`;

    navigate(
      {
        pathname,
      },
      { relative: 'path' },
    );
  };

  return (
    <ListPage
      onCreateItem={handleNewItem}
      activeSegmentIndex={segment}
      disabled={isReadonly}
      onWrapperLayout={(props) =>
        enableNestedSegments ? (
          <>
            {props.pageContent}
            {props.detailPageContent}
            {/* Placeholder here for possible DetailPageRouteModal */}
            <Outlet />
          </>
        ) : (
          props.pageContent
        )
      }
      {...listPageProps}
      tabs={tabs}
      onNeedData={handleNeedData}
      defaultFilter={filtersInQS}
    />
  );
}

export default ListPageRoute;
