import React, { PropsWithChildren } from 'react';

interface FieldGroupProviderProps {
  group?: string;
}

export const FieldGroupContext = React.createContext<{ group?: string }>({});

function FieldGroupProvider({ children, group }: PropsWithChildren<FieldGroupProviderProps>) {
  return <FieldGroupContext.Provider value={{ group }}>{children}</FieldGroupContext.Provider>;
}

export default FieldGroupProvider;
