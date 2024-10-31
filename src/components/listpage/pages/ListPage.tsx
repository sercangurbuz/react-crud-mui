import { useState } from 'react';
import { DeepPartial, FieldValues } from 'react-hook-form';

import useSettings from '../../settings-provider/hooks/useSettings';
import { INITIAL_PAGEINDEX } from '../constants';
import { ListPageFilter, ListPageMeta } from './ListPageFilter';
import ListPageForm, { ListPageFormProps } from './ListPageForm';
import ListPageModal from './ListPageModal';
import ListPageRoute from './ListPageRoute';
import ListPageSelection from './ListPageSelection';

export interface ListPageProps<
  TModel extends FieldValues,
  TFilter extends FieldValues = FieldValues,
  TDetailPageModel extends FieldValues = FieldValues,
> extends Omit<ListPageFormProps<TModel, TFilter, TDetailPageModel>, 'onChange' | 'meta'> {
  /**
   * Data fetcher function with given filter
   */
  onNeedData?: (filter: ListPageFilter<TFilter> | undefined) => void;
}

function ListPage<
  TModel extends FieldValues,
  TFilter extends FieldValues = FieldValues,
  TDetailPageModel extends FieldValues = FieldValues,
>(props: ListPageProps<TModel, TFilter, TDetailPageModel>) {
  const { defaultFilter, onNeedData, tableProps, defaultSegmentIndex, activeSegmentIndex } = props;
  const { pageSize: defaultPageSize } = useSettings();

  /* -------------------------------------------------------------------------- */
  /*                                    Hooks                                   */
  /* -------------------------------------------------------------------------- */

  const [meta, setMeta] = useState<ListPageMeta>(() => {
    return {
      pagination: {
        pageIndex: INITIAL_PAGEINDEX,
        pageSize: defaultPageSize,
        ...tableProps?.initialState?.pagination,
        ...defaultFilter?.meta?.pagination,
      },
      sorting: defaultFilter?.meta?.sorting ?? tableProps?.initialState?.sorting ?? [],
      columnFilters:
        defaultFilter?.meta?.columnFilters ?? tableProps?.initialState?.columnFilters ?? [],
      segmentIndex: activeSegmentIndex ?? defaultSegmentIndex,
      reason: 'init',
    };
  });

  /* -------------------------------------------------------------------------- */
  /*                                Data Effects                                */
  /* -------------------------------------------------------------------------- */

  const handleChange = (filter: TFilter, updatedMeta?: DeepPartial<ListPageMeta>) => {
    let _meta = meta;

    if (updatedMeta) {
      _meta = {
        ...meta,
        ...updatedMeta,
        pagination: {
          ...meta.pagination,
          ...updatedMeta.pagination,
        },
      } as ListPageMeta;
      setMeta(_meta);
    }

    onNeedData?.({
      ...filter,
      meta: _meta,
    });
  };

  return <ListPageForm {...props} meta={meta} onChange={handleChange} />;
}

ListPage.Selection = ListPageSelection;
ListPage.Modal = ListPageModal;
ListPage.Route = ListPageRoute;

export default ListPage;
