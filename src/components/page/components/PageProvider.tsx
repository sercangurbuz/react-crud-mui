import React, { PropsWithChildren } from 'react';

export type PaddingSize = 'small' | 'normal' | 'large';

export interface PageProviderProps {
  size: PaddingSize;
  disabled?: boolean;
  loading?: boolean;
}

export const PageContext = React.createContext<PageProviderProps>({
  size: 'normal',
  disabled: false,
  loading: false,
});

function PageProvider({ children, disabled, size }: PropsWithChildren<PageProviderProps>) {
  return <PageContext.Provider value={{ disabled, size }}>{children}</PageContext.Provider>;
}

export default PageProvider;
