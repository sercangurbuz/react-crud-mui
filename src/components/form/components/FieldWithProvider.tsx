import React, { PropsWithChildren, useCallback } from 'react';

export interface FieldWithProviderProps {
  prefix?: string;
  suffix?: string;
  getName?: (name: string) => string;
}

export const FieldWithContext = React.createContext<FieldWithProviderProps>({
  prefix: '',
  suffix: '',
  getName: (name: string) => name,
});

function FieldWithProvider({
  children,
  prefix,
  suffix,
}: PropsWithChildren<FieldWithProviderProps>) {
  const getFieldName = useCallback(
    (name: string) => {
      let result = prefix ? `${prefix}.${name}` : name;
      result = suffix ? `${result}.${prefix}` : result;
      return result;
    },
    [prefix, suffix],
  );
  return (
    <FieldWithContext.Provider value={{ prefix, suffix, getName: getFieldName }}>
      {children}
    </FieldWithContext.Provider>
  );
}

export default FieldWithProvider;
