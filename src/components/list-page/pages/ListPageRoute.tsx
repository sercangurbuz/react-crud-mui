import { useState } from 'react';
import { DeepPartial, FieldValues } from 'react-hook-form';
import { Outlet, useNavigate } from 'react-router-dom';

import useSettings from '../../crud-mui-provider/hooks/useSettings';
import useSegmentParams, {
  UseSegmentParamsOptions,
} from '../../detail-page/hooks/useSegmentParams';
import { updateQueryString } from '../../misc';
import useURLSearchFilter from '../hooks/useURLSearchFilter';
import ListPage, { ListPageProps } from './ListPage';
import { ListPageMeta } from './ListPageFilter';

export interface ListPageRouteProps<
  TModel extends FieldValues,
  TFilter extends FieldValues = FieldValues,
  TDetailPageModel extends FieldValues = TModel,
> extends ListPageProps<TModel, TFilter, TDetailPageModel>,
    Omit<UseSegmentParamsOptions, 'paths'> {
  enableQueryStringFilter?: boolean;
}

/**
 * ListPage with routing based on react-router
 */
function ListPageRoute<
  TModel extends FieldValues,
  TFilter extends FieldValues = FieldValues,
  TDetailPageModel extends FieldValues = TModel,
>({
  defaultFilter,
  defaultMeta,
  enableNestedSegments,
  enableQueryStringFilter = true,
  enableSegmentRouting = true,
  fallbackSegmentIndex,
  onNeedData,
  tabs,
  defaultValues,
  ...listPageProps
}: ListPageRouteProps<TModel, TFilter, TDetailPageModel>) {
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

  const { getFiltersInQS, setFiltersInQS } = useURLSearchFilter<TFilter>({ defaultValues });
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

  const handleNavigate = (model: TModel, options: { copy?: boolean; disabled?: boolean } = {}) => {
    let pathname = `./${model[uniqueIdParamName]}`;

    if (options?.copy) {
      pathname = updateQueryString(pathname, { copy: '' });
    }

    if (options?.disabled) {
      pathname = updateQueryString(pathname, { disabled: '' });
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
      onCreate={handleNavigateCreate}
      onEdit={(model) => handleNavigate(model)}
      onCopy={(model) => handleNavigate(model, { copy: true })}
      onView={(model) => handleNavigate(model, { disabled: true })}
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
