import React, { useContext } from 'react';
import { FieldValues } from 'react-hook-form';

import { DetailPageContentProps } from '../pages/DetailPageContent';

/* ---------------------------- ListPage Context ---------------------------- */
export type DetailPageContextType<TModel extends FieldValues = FieldValues> = Pick<
  DetailPageContentProps<TModel>,
  | 'loading'
  | 'enableClose'
  | 'enableCopy'
  | 'enableCreate'
  | 'enableDelete'
  | 'enableDiscardChanges'
  | 'enableSave'
  | 'reason'
  | 'disabled'
  | 'data'
  | 'activeSegmentIndex'
> & {
  onSave: () => void;
  setActiveSegmentIndex: (index: number) => void;
};

//https://stackoverflow.com/questions/60725621/react-context-with-generics
export const DetailPageContext = React.createContext<DetailPageContextType | null>(null);

const useDetailPage = <TModel extends FieldValues = FieldValues>() => {
  const contextValues = useContext(DetailPageContext) as DetailPageContextType<TModel>;
  return contextValues;
};

export default useDetailPage;
