import { useState } from 'react';
import { DeepPartial, FieldValues } from 'react-hook-form';

import merge from 'lodash.merge';

import removeFalsy from '../../misc/removeFalsy';
import { TabChangedPayload } from '../../page/components/DefaultTabs';
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
  /**
   * Remove falsy values of filter before call OnNeedData
   */
  removeFalsyFilterValues?: boolean;
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
  const {
    onNeedData,
    defaultSegmentIndex = 0,
    activeSegmentIndex,
    tabs,
    defaultMeta,
    removeFalsyFilterValues = true,
  } = props;

  /* -------------------------------------------------------------------------- */
  /*                                    Hooks                                   */
  /* -------------------------------------------------------------------------- */

  const [meta, setMeta] = useState<ListPageMeta>(() => {
    let tabProps: TabChangedPayload | undefined;
    if (tabs) {
      const selectedTabIndex = activeSegmentIndex ?? defaultSegmentIndex;
      const selectedTabValue = tabs
        ? selectedTabIndex <= tabs.length - 1
          ? tabs[selectedTabIndex].value
          : ''
        : '';
      tabProps = {
        selectedTabIndex,
        selectedTabValue,
      };
    }

    return merge({}, DEFAULT_LISTPAGE_META, defaultMeta, tabProps);
  });

  /* -------------------------------------------------------------------------- */
  /*                                Data Effects                                */
  /* -------------------------------------------------------------------------- */

  const handleChange = (filter: TFilter, updated: DeepPartial<ListPageMeta>) => {
    const updatedMeta = merge({}, meta, updated) as ListPageMeta;

    setMeta(updatedMeta);
    onNeedData?.(removeFalsyFilterValues ? removeFalsy(filter) : filter, updatedMeta);
  };

  return <ListPageForm {...props} meta={meta} onChange={handleChange} />;
}

ListPage.Selection = ListPageSelection;
ListPage.Modal = ListPageModal;
ListPage.Route = ListPageRoute;

export default ListPage;
