import { useState } from 'react';
import { DeepPartial, FieldValues } from 'react-hook-form';

import merge from 'lodash.merge';

import { DEFAULT_PAGEINDEX, DEFAULT_PAGESIZE } from '../constants';
import { ListPageMeta } from './ListPageFilter';
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
  onNeedData?: (filter: TFilter, _meta: ListPageMeta) => void;
}

/* ---------------------------------- Const --------------------------------- */

const DEFAULT_LISTPAGE_META: ListPageMeta = {
  pagination: {
    pageIndex: DEFAULT_PAGEINDEX,
    pageSize: DEFAULT_PAGESIZE,
  },
  sorting: [],
  columnFilters: [],
  selectedTabIndex: 0,
  selectedTabValue: '',
  reason: 'init',
};

function ListPage<
  TModel extends FieldValues,
  TFilter extends FieldValues = FieldValues,
  TDetailPageModel extends FieldValues = FieldValues,
>(props: ListPageProps<TModel, TFilter, TDetailPageModel>) {
  const { onNeedData, defaultSegmentIndex = 0, activeSegmentIndex, tabs, defaultMeta } = props;

  /* -------------------------------------------------------------------------- */
  /*                                    Hooks                                   */
  /* -------------------------------------------------------------------------- */

  const [meta, setMeta] = useState<ListPageMeta>(() => {
    const selectedTabIndex = activeSegmentIndex ?? defaultSegmentIndex;
    const selectedTabValue = tabs
      ? selectedTabIndex <= tabs.length - 1
        ? tabs[selectedTabIndex].value
        : ''
      : '';

    return merge({}, DEFAULT_LISTPAGE_META, defaultMeta, {
      selectedTabIndex,
      selectedTabValue,
    });
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

    onNeedData?.(filter, _meta);
  };

  return <ListPageForm {...props} meta={meta} onChange={handleChange} />;
}

ListPage.Selection = ListPageSelection;
ListPage.Modal = ListPageModal;
ListPage.Route = ListPageRoute;

export default ListPage;
