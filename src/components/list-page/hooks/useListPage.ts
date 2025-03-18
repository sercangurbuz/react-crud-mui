/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useContext } from 'react';
import { FieldValues } from 'react-hook-form';

import { NeedDataReason } from '../../detail-page/pages/DetailPageContent';
import { ListPageProps } from '../pages/ListPage';

/* ---------------------------- ListPage Context ---------------------------- */
export type ListPageContextType<TModel extends FieldValues> = {
  data?: TModel[];
  /**
   * Clear all form controls in filter
   */
  clear: () => void;
  /**
   * Trigger search with defined filter criterias
   */
  search: () => void;
  /**
   * Used for built in detailpage opener
   */
  triggerAction: (reason: NeedDataReason, data?: TModel) => void;
} & Pick<
  ListPageProps<TModel>,
  'loading' | 'enableClear' | 'enableCreateItem' | 'enableExport' | 'enableSearch'
>;

//https://stackoverflow.com/questions/60725621/react-context-with-generics
export const ListPageContext = React.createContext<ListPageContextType<any> | null>(null);

const useListPage = <TModel extends FieldValues>() => {
  const injectedProps = useContext(ListPageContext);
  return injectedProps as ListPageContextType<TModel>;
};

export default useListPage;
