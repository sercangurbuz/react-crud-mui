import React, { PropsWithChildren } from 'react';

export interface FormDisabledProviderProps {
  disabled?: boolean;
}

export const FormDisabledContext = React.createContext<FormDisabledProviderProps>({
  disabled: false,
});

function FormDisabledProvider({
  children,
  disabled,
}: PropsWithChildren<FormDisabledProviderProps>) {
  return (
    <FormDisabledContext.Provider value={{ disabled }}>{children}</FormDisabledContext.Provider>
  );
}

export default FormDisabledProvider;
