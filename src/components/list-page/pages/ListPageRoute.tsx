import { useState } from 'react';
import { DeepPartial, FieldValues } from 'react-hook-form';
import { Outlet, useNavigate } from 'react-router-dom';

import useSettings from '../../crud-mui-provider/hooks/useSettings';
import useSegmentParams, {
  UseSegmentParamsOptions,
} from '../../detail-page/hooks/useSegmentParams';
import useURLSearchFilter from '../hooks/useURLSearchFilter';
import ListPage, { ListPageProps } from './ListPage';
import { ListPageMeta } from './ListPageFilter';

export interface ListPageRouteProps<
  TModel extends FieldValues,
  TFilter extends FieldValues = FieldValues,
  TDetailPageModel extends FieldValues = FieldValues,
> extends ListPageProps<TModel, TFilter, TDetailPageModel>,
    Omit<UseSegmentParamsOptions, 'paths' | 'enableSegmentRouting'> {
  enableQueryStringFilter?: boolean;
  ignoreQueryStringFilter?: string[];
}

/**
 * ListPage with routing based on react-router
 */
function ListPageRoute<
  TModel extends FieldValues,
  TFilter extends FieldValues = FieldValues,
  TDetailPageModel extends FieldValues = FieldValues,
>({
  defaultFilter,
  defaultMeta,
  enableNestedSegments,
  enableQueryStringFilter = true,
  fallbackSegmentIndex,
  ignoreQueryStringFilter = [],
  onNeedData,
  tabs,
  ...listPageProps
}: ListPageRouteProps<TModel, TFilter, TDetailPageModel>) {
  /* -------------------------------------------------------------------------- */
  /*                                    Hooks                                   */
  /* -------------------------------------------------------------------------- */

  const { newItemParamValue } = useSettings();
  const navigate = useNavigate();

  /* -------------------------------------------------------------------------- */
  /*                                   Filter                                   */
  /* -------------------------------------------------------------------------- */

  const [segment, setSegment, { segmentParamName }] = useSegmentParams({
    enableNestedSegments,
    fallbackSegmentIndex,
    paths: tabs,
  });

  const { getFiltersInQS, setFiltersInQS } = useURLSearchFilter<TFilter>();
  const [defaultFilterProps] = useState(() => {
    if (enableQueryStringFilter) {
      const { filter, meta } = getFiltersInQS({
        ignoreList: [segmentParamName, ...ignoreQueryStringFilter],
      });
      return {
        defaultFilter: {
          ...filter,
          ...defaultFilter,
        },
        defaultMeta: {
          ...meta,
          ...defaultMeta,
        },
      } as { defaultFilter: Partial<TFilter>; defaultMeta: DeepPartial<ListPageMeta> };
    }

    return { defaultFilter, defaultMeta };
  });

  /* -------------------------------------------------------------------------- */
  /*                                   Events                                   */
  /* -------------------------------------------------------------------------- */

  const handleNeedData = (filter: TFilter, meta: ListPageMeta) => {
    if (enableQueryStringFilter) {
      setFiltersInQS(filter, meta);
    }

    const { reason, selectedTabIndex } = meta;

    if (reason === 'tabChanged') {
      setSegment(selectedTabIndex);

      if (enableNestedSegments) {
        return;
      }
    }

    onNeedData?.(filter, meta);
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
      {...defaultFilterProps}
    />
  );
}

export default ListPageRoute;
