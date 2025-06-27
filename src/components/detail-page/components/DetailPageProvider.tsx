import React, { PropsWithChildren, useMemo } from 'react';
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

export const DetailPageContext = React.createContext<DetailPageContextType | null>(null);

function DetailPageProvider({
  children,
  data,
  reason,
  loading,
  enableCopy,
  enableCreate,
  enableClose,
  enableDiscardChanges,
  enableDelete,
  onSave,
  enableSave,
  disabled,
  activeSegmentIndex,
  setActiveSegmentIndex,
}: PropsWithChildren & DetailPageContextType) {
  const contextValue = useMemo<DetailPageContextType>(
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
      onSave,
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
      onSave,
      setActiveSegmentIndex,
    ],
  );

  return <DetailPageContext.Provider value={contextValue}>{children}</DetailPageContext.Provider>;
}

export default DetailPageProvider;
