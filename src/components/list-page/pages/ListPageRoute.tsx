import { useState } from 'react';
import { DeepPartial, FieldValues } from 'react-hook-form';
import { Outlet, useNavigate, useSearchParams } from 'react-router-dom';

import useSegmentParams, {
  UseSegmentParamsOptions,
} from '../../detail-page/hooks/useSegmentParams';
import useSettings from '../../settings-provider/hooks/useSettings';
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
}

function ListPageRoute<
  TModel extends FieldValues,
  TFilter extends FieldValues = FieldValues,
  TDetailPageModel extends FieldValues = FieldValues,
>({
  enableQueryStringFilter = true,
  enableNestedSegments,
  fallbackSegmentIndex,
  defaultFilter,
  tabs,
  onNeedData,
  defaultMeta,
  ...listPageProps
}: ListPageRouteProps<TModel, TFilter, TDetailPageModel>) {
  /* -------------------------------------------------------------------------- */
  /*                                    Hooks                                   */
  /* -------------------------------------------------------------------------- */

  const { newItemParamValue } = useSettings();
  const navigate = useNavigate();
  const [currentQueryParameters] = useSearchParams();
  const isReadonly = currentQueryParameters.has('readonly');

  /* -------------------------------------------------------------------------- */
  /*                                   Filter                                   */
  /* -------------------------------------------------------------------------- */

  const [segment, setSegment] = useSegmentParams({
    enableNestedSegments,
    fallbackSegmentIndex,
    paths: tabs,
  });

  const { getFiltersInQS, setFiltersInQS } = useURLSearchFilter<TFilter>();
  const [defaultFilterProps] = useState(() => {
    if (enableQueryStringFilter) {
      const { filter, meta } = getFiltersInQS();
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

  const handleNeedData = (filter: TFilter, _meta: ListPageMeta) => {
    if (enableQueryStringFilter) {
      setFiltersInQS(filter, _meta);
    }

    const { reason, selectedTabIndex } = _meta;

    if (reason === 'tabChanged') {
      setSegment(selectedTabIndex);

      if (enableNestedSegments) {
        return;
      }
    }

    onNeedData?.(filter, _meta);
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
      {...defaultFilterProps}
    />
  );
}

export default ListPageRoute;
