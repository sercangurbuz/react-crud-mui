import React, { PropsWithChildren, useState } from 'react';

export interface FormStatesProviderProps {
  isTouched?: boolean;
  setTouched?: (value: boolean) => void;
}

export const FormStatesContext = React.createContext<FormStatesProviderProps>({
  isTouched: false,
  setTouched: () => {},
});

function FormStatesProvider({ children }: PropsWithChildren) {
  const [touched, setTouched] = useState<boolean>(false);

  return (
    <FormStatesContext.Provider value={{ isTouched: touched, setTouched }}>
      {children}
    </FormStatesContext.Provider>
  );
}

export default FormStatesProvider;
