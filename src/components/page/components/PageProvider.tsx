import React, { PropsWithChildren } from 'react';

import usePage from '../hooks/usePage';

export type PaddingSize = 'small' | 'normal' | 'large';

export interface PageProviderProps {
  size?: PaddingSize;
  disabled?: boolean;
  loading?: boolean;
}

export const PageContext = React.createContext<PageProviderProps>({
  size: 'normal',
  disabled: false,
  loading: false,
});

function PageProvider({ children, disabled, size }: PropsWithChildren<PageProviderProps>) {
  const parentPageContext = usePage();
  return (
    <PageContext.Provider
      value={{
        disabled: parentPageContext?.disabled === true ? true : disabled,
        size: size || parentPageContext?.size,
      }}
    >
      {children}
    </PageContext.Provider>
  );
}

export default PageProvider;
