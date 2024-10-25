/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useContext } from 'react';
import { FieldValues } from 'react-hook-form';

import { ListPageProps } from '../pages/ListPage';
import { ListPageMeta, ListPageModel } from '../pages/ListPageData';

/* ---------------------------- ListPage Context ---------------------------- */
export type ListPageContextType<TModel extends FieldValues, TFilter extends FieldValues> = {
  data?: ListPageModel<TModel>;
  /**
   * Clear all form controls in filter
   */
  clear: () => void;
  /**
   * Trigger search with defined filter criterias
   */
  search: () => void;
  /**
   * Current filter object
   */
  currentFilter?: TFilter;
  /**
   * Current meta object
   */
  meta: ListPageMeta;
  /**
   * Used for built in detailpage opener
   */
  onShowDetailPage: (model?: any) => void;
} & Pick<
  ListPageProps<TModel, TFilter>,
  'loading' | 'enableClear' | 'enableCreateItem' | 'enableExport' | 'enableSearch'
>;

//https://stackoverflow.com/questions/60725621/react-context-with-generics
export const ListPageContext = React.createContext<ListPageContextType<any, any> | null>(null);

const useListPage = <TModel extends FieldValues, TFilter extends FieldValues>() => {
  const injectedProps = useContext(ListPageContext);
  return injectedProps as ListPageContextType<TModel, TFilter>;
};

export default useListPage;
