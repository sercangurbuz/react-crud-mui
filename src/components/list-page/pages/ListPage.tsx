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
> extends Omit<ListPageFormProps<TModel, TFilter>, 'onChange' | 'meta'> {
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

/**
 * Simple list with filter and table
 */
function ListPage<TModel extends FieldValues, TFilter extends FieldValues = FieldValues>({
  activeSegmentIndex,
  defaultMeta,
  defaultSegmentIndex = 0,
  onNeedData,
  removeFalsyFilterValues = true,
  tableMode = 'server',
  tabs,
  ...lpProps
}: ListPageProps<TModel, TFilter>) {
  /* -------------------------------------------------------------------------- */
  /*                                    Hooks                                   */
  /* -------------------------------------------------------------------------- */

  const [meta, setMeta] = useState<ListPageMeta>(() => {
    let tabsMeta: TabChangedPayload | undefined;
    if (tabs) {
      const selectedTabIndex = activeSegmentIndex ?? defaultSegmentIndex;
      const selectedTabValue = tabs
        ? selectedTabIndex <= tabs.length - 1
          ? tabs[selectedTabIndex].value
          : ''
        : '';
      tabsMeta = {
        selectedTabIndex,
        selectedTabValue,
      };
    }

    return merge({}, DEFAULT_LISTPAGE_META, defaultMeta, tabsMeta);
  });

  /* -------------------------------------------------------------------------- */
  /*                                Data Effects                                */
  /* -------------------------------------------------------------------------- */

  const handleChange = (filter: TFilter, updated: DeepPartial<ListPageMeta>) => {
    setMeta((prev) => {
      const updatedMeta = {
        ...prev,
        ...updated,
        pagination: {
          ...prev.pagination,
          ...updated.pagination,
        },
      } as ListPageMeta;

      if (
        tableMode === 'client' &&
        (updatedMeta.reason === 'pagination' ||
          updatedMeta.reason === 'sorting' ||
          updatedMeta.reason === 'columnfilter')
      ) {
        return updatedMeta;
      }
      //as deps is omitted from useFormInitEffect ,meta is always equals to one in previous render.
      //to overcome,updater function is used here and onNeedata called within the setter
      onNeedData?.(removeFalsyFilterValues ? removeFalsy(filter) : filter, updatedMeta);
      return updatedMeta;
    });
  };

  return (
    <ListPageForm
      {...lpProps}
      meta={meta}
      onChange={handleChange}
      defaultSegmentIndex={defaultSegmentIndex}
      activeSegmentIndex={activeSegmentIndex}
      tabs={tabs}
      defaultMeta={defaultMeta}
      tableMode={tableMode}
    />
  );
}

ListPage.Selection = ListPageSelection;
ListPage.Modal = ListPageModal;
ListPage.Route = ListPageRoute;

export default ListPage;
