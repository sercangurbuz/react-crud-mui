import { useState } from 'react';
import { DeepPartial, FieldValues } from 'react-hook-form';
import { Outlet, useNavigate } from 'react-router-dom';

import useSettings from '../../crud-mui-provider/hooks/useSettings';
import useSegmentParams, {
  UseSegmentParamsOptions,
} from '../../detail-page/hooks/useSegmentParams';
import { NeedDataReason } from '../../detail-page/pages/DetailPageContent';
import { updateQueryString } from '../../misc';
import useURLSearchFilter, { MatchFields } from '../hooks/useURLSearchFilter';
import ListPage, { ListPageProps } from './ListPage';
import { ListPageMeta } from './ListPageFilter';

export interface ListPageRouteProps<
  TModel extends FieldValues,
  TFilter extends FieldValues = FieldValues,
> extends ListPageProps<TModel, TFilter>,
    Omit<UseSegmentParamsOptions, 'paths'> {
  enableQueryStringFilter?: boolean | MatchFields<TFilter>;
}

/**
 * ListPage with routing based on react-router
 */
function ListPageRoute<TModel extends FieldValues, TFilter extends FieldValues = FieldValues>({
  defaultFilter,
  defaultMeta,
  enableNestedSegments,
  enableQueryStringFilter = true,
  enableSegmentRouting = true,
  fallbackSegmentIndex,
  onNeedData,
  tabs,
  defaultValues,
  onActionClick,
  ...listPageProps
}: ListPageRouteProps<TModel, TFilter>) {
  /* -------------------------------------------------------------------------- */
  /*                                    Hooks                                   */
  /* -------------------------------------------------------------------------- */

  const { newItemParamValue, uniqueIdParamName } = useSettings();
  const navigate = useNavigate();

  /* -------------------------------------------------------------------------- */
  /*                                   Filter                                   */
  /* -------------------------------------------------------------------------- */

  const [segment, setSegment, { segmentParamName }] = useSegmentParams({
    enableNestedSegments,
    fallbackSegmentIndex,
    enableSegmentRouting,
    paths: tabs,
  });

  const { getFiltersInQS, setFiltersInQS } = useURLSearchFilter<TFilter>({
    defaultValues,
    matcher: typeof enableQueryStringFilter === 'object' ? enableQueryStringFilter : undefined,
  });
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

  const handleNeedData = (filter: TFilter, meta: ListPageMeta) => {
    const { reason, selectedTabIndex } = meta;

    if (reason === 'tabChanged' && enableNestedSegments) {
      setSegment(selectedTabIndex);
      return;
    }

    if (enableQueryStringFilter) {
      let extraFilter: Record<string, unknown> | undefined = undefined;

      if (enableSegmentRouting && !enableNestedSegments && selectedTabIndex) {
        extraFilter = {
          [segmentParamName]: selectedTabIndex,
        };
      }
      setFiltersInQS(filter, meta, extraFilter);
    }

    onNeedData?.(filter, meta);
  };

  const handleNavigateCreate = () => {
    const pathname = `./${newItemParamValue}`;

    navigate(
      {
        pathname,
      },
      { relative: 'path' },
    );
  };

  const handleNavigate = (reason: NeedDataReason | 'delete', model?: TModel) => {
    const pathname = `./${model?.[uniqueIdParamName]}`;
    let search = '';

    if (reason === 'copy') {
      search = updateQueryString(search, { copy: '' });
    }

    if (reason === 'view') {
      search = updateQueryString(search, { disabled: '' });
    }

    navigate(
      {
        pathname,
        search,
      },
      { relative: 'path' },
    );
  };

  return (
    <ListPage
      onActionClick={(reason, model) => {
        if (reason !== 'delete') {
          // eslint-disable-next-line @typescript-eslint/no-unused-expressions
          reason === 'create' ? handleNavigateCreate() : handleNavigate(reason, model);
        }
        onActionClick?.(reason, model);
      }}
      activeSegmentIndex={segment}
      onWrapperLayout={(props) => (
        <>
          {props.pageContent}
          {props.detailPageContent}
          {/* Placeholder here for possible DetailPageRouteModal */}
          {enableNestedSegments ? <Outlet /> : null}
        </>
      )}
      {...listPageProps}
      tabs={tabs}
      onNeedData={handleNeedData}
      defaultValues={defaultValues}
      {...defaultFilterProps}
    />
  );
}

export default ListPageRoute;
