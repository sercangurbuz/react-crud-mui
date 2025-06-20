import React, { PropsWithChildren } from 'react';

interface FieldWithProviderProps {
  prefix?: string;
  suffix?: string;
}

export const FieldWithContext = React.createContext<{ prefix?: string; suffix?: string }>({});

function FieldWithProvider({
  children,
  prefix,
  suffix,
}: PropsWithChildren<FieldWithProviderProps>) {
  return (
    <FieldWithContext.Provider value={{ prefix, suffix }}>{children}</FieldWithContext.Provider>
  );
}

export default FieldWithProvider;
