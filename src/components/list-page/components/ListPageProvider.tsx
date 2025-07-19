import React, { PropsWithChildren, useMemo } from 'react';
import { FieldValues } from 'react-hook-form';

import { NeedDataReason } from '../../detail-page/pages/DetailPageContent';
import { ListPageProps } from '../pages/ListPage';

/* ---------------------------- ListPage Context ---------------------------- */

export type ListPageContextType<TModel extends FieldValues = FieldValues> = {
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const ListPageContext = React.createContext<ListPageContextType<any> | null>(null);

function ListPageProvider<TModel extends FieldValues = FieldValues>({
  children,
  data,
  loading,
  enableClear,
  enableCreateItem,
  enableExport,
  enableSearch,
  search: onSearch,
  clear: onClear,
  triggerAction,
}: PropsWithChildren & ListPageContextType<TModel>) {
  const contextValue = useMemo<ListPageContextType<TModel>>(
    () => ({
      triggerAction,
      loading,
      data,
      search: onSearch,
      clear: onClear,
      enableClear,
      enableCreateItem,
      enableExport,
      enableSearch,
    }),
    [
      data,
      enableClear,
      enableCreateItem,
      enableExport,
      enableSearch,
      loading,
      onClear,
      triggerAction,
      onSearch,
    ],
  );

  return <ListPageContext.Provider value={contextValue}>{children}</ListPageContext.Provider>;
}

export default ListPageProvider;
