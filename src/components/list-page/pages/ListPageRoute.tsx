import { useMemo } from 'react';
import { DeepPartial, FieldValues } from 'react-hook-form';
import { Outlet, useNavigate } from 'react-router-dom';

import { Action } from '../../action-table/ActionTable';
import useSettings from '../../crud-mui-provider/hooks/useSettings';
import useSegmentParams, {
  UseSegmentParamsOptions,
} from '../../detail-page/hooks/useSegmentParams';
import useURLSearchFilter, { MatchFields } from '../hooks/useURLSearchFilter';
import ListPage, { ListPageProps } from './ListPage';
import { ListPageMeta } from './ListPageFilter';

export interface ListPageRouteProps<
  TModel extends FieldValues,
  TFilter extends FieldValues = FieldValues,
> extends ListPageProps<TModel, TFilter>,
    Omit<UseSegmentParamsOptions, 'paths'> {
  enableQueryStringFilter?: boolean | MatchFields<TFilter>;
  uniqueIdParamName?: string;
  onGetNavigatePathName?: (
    action: Action,
    model: TModel | undefined,
    defaultPath: string,
  ) => string;
}

/**
 * ListPage with routing based on react-router
 */
function ListPageRoute<TModel extends FieldValues, TFilter extends FieldValues = FieldValues>({
  actionProps,
  defaultFilter,
  defaultMeta,
  enableNestedSegments,
  enableQueryStringFilter = false,
  enableSegmentRouting = true,
  fallbackSegmentIndex,
  onGetNavigatePathName,
  onNeedData,
  tabs,
  uniqueIdParamName,
  ...listPageProps
}: ListPageRouteProps<TModel, TFilter>) {
  /* -------------------------------------------------------------------------- */
  /*                                    Hooks                                   */
  /* -------------------------------------------------------------------------- */

  const { newItemParamValue, uniqueIdParamName: defaultUniqueIdParamName } = useSettings();
  const navigate = useNavigate();

  const uniqueIdParam = uniqueIdParamName || defaultUniqueIdParamName;

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
    matcher: typeof enableQueryStringFilter === 'object' ? enableQueryStringFilter : undefined,
  });
  const defaultFilterProps = useMemo(() => {
    if (enableQueryStringFilter) {
      const { filter, meta } = getFiltersInQS();
      return {
        defaultFilter: {
          ...defaultFilter,
          ...filter,
        },
        defaultMeta: {
          ...meta,
          ...defaultMeta,
        },
      } as { defaultFilter: Partial<TFilter>; defaultMeta: DeepPartial<ListPageMeta> };
    }

    return { defaultFilter, defaultMeta };
    // We intentionally leave the dependency array empty to calculate defaultFilterProps only once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    let pathname = `./${newItemParamValue}`;

    if (onGetNavigatePathName) {
      pathname = onGetNavigatePathName('create', undefined, pathname);
    }

    navigate(
      {
        pathname,
      },
      { relative: 'path' },
    );
  };

  const handleNavigate = (action: Action, model?: TModel) => {
    let pathname = `./${action}/${model?.[uniqueIdParam]}`;

    if (onGetNavigatePathName) {
      pathname = onGetNavigatePathName(action, model, pathname);
    }

    navigate(
      {
        pathname,
      },
      { relative: 'path' },
    );
  };

  return (
    <ListPage
      actionProps={{
        ...actionProps,
        onActionClick(action, model, args, props) {
          switch (action) {
            case 'create':
              handleNavigateCreate();
              break;
            case 'fetch':
            case 'view':
            case 'copy':
              handleNavigate(action, model);
              break;
          }

          actionProps?.onActionClick?.(action, model, args, props);
        },
      }}
      activeSegmentIndex={segment}
      onWrapperLayout={(props) => (
        <>
          {props.pageContent}
          {props.detailPageContent}
          {props.autoSearchContent}
          {/* Placeholder here for possible DetailPageRouteModal */}
          <Outlet />
        </>
      )}
      {...listPageProps}
      tabs={tabs}
      onNeedData={handleNeedData}
      {...defaultFilterProps}
    />
  );
}

export default ListPageRoute;
