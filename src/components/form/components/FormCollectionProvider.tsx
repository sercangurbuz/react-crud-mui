import React, { PropsWithChildren, useCallback, useMemo, useState } from 'react';
import { FieldValues } from 'react-hook-form';

import { UseFormReturn } from '../hooks/useForm';

export interface FormCollectionContextType {
  forms?: Map<string, UseFormReturn>;
  registerForm?: (data: FormData) => void;
  unRegisterForm?: (name: string) => void;
}

export const FormCollectionContext = React.createContext<FormCollectionContextType>({});

export type FormData<TFieldValues extends FieldValues = FieldValues> = {
  name: string;
  form: UseFormReturn<TFieldValues>;
};

function FormCollectionProvider({ children }: PropsWithChildren) {
  /* -------------------------------------------------------------------------- */
  /*                                    Hooks                                   */
  /* -------------------------------------------------------------------------- */

  const [forms, setForms] = useState(() => new Map<string, UseFormReturn>());

  /* -------------------------------------------------------------------------- */
  /*                                 Methods                                    */
  /* -------------------------------------------------------------------------- */

  const registerForm = useCallback((data: FormData) => {
    setForms((prevForms) => {
      const newForms = new Map(prevForms);
      newForms.set(data.name, data.form);
      return newForms;
    });
  }, []);

  const unRegisterForm = useCallback((name: string) => {
    setForms((prevForms) => {
      const newForms = new Map(prevForms);
      newForms.delete(name);
      return newForms;
    });
  }, []);

  const contextValue = useMemo<FormCollectionContextType>(
    () => ({
      forms,
      registerForm,
      unRegisterForm,
    }),
    [forms, registerForm, unRegisterForm],
  );

  return (
    <FormCollectionContext.Provider value={contextValue}>{children}</FormCollectionContext.Provider>
  );
}

export default FormCollectionProvider;
