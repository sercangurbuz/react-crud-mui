import React, { PropsWithChildren, useMemo } from 'react';
import { FieldValues } from 'react-hook-form';

import { DetailPageContentProps } from '../pages/DetailPageContent';
import { SaveOptions } from '../pages/DetailPageData';

/* ---------------------------- DetailPage Context ---------------------------- */
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
  save: (options?: SaveOptions) => void;
  setActiveSegmentIndex: (index: number) => void;
};

export const DetailPageContext = React.createContext<DetailPageContextType | null>(null);

function DetailPageProvider<TModel extends FieldValues = FieldValues>({
  children,
  data,
  reason,
  loading,
  enableCopy,
  enableCreate,
  enableClose,
  enableDiscardChanges,
  enableDelete,
  save,
  enableSave,
  disabled,
  activeSegmentIndex,
  setActiveSegmentIndex,
}: PropsWithChildren & DetailPageContextType<TModel>) {
  const contextValue = useMemo<DetailPageContextType<TModel>>(
    () => ({
      data,
      reason,
      loading,
      enableCopy: enableCopy && enableCreate,
      enableClose,
      enableCreate,
      enableDelete,
      enableDiscardChanges,
      enableSave,
      disabled,
      activeSegmentIndex,
      save,
      setActiveSegmentIndex,
    }),
    [
      data,
      reason,
      loading,
      enableCopy,
      enableCreate,
      enableClose,
      enableDelete,
      enableDiscardChanges,
      enableSave,
      disabled,
      activeSegmentIndex,
      save,
      setActiveSegmentIndex,
    ],
  );

  return <DetailPageContext.Provider value={contextValue}>{children}</DetailPageContext.Provider>;
}

export default DetailPageProvider;
