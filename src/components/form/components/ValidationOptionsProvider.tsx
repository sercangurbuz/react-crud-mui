import React, { PropsWithChildren } from 'react';
import { FieldValues } from 'react-hook-form';

import { ValidationOptions } from '../hooks/useForm';
import useValidationOptionsContext from '../hooks/useValidationOptionsContext';

export type ValidationOptionsProviderProps<TFieldValues extends FieldValues = FieldValues> =
  ValidationOptions<TFieldValues>;

export const ValidationOptionsContext = React.createContext<ValidationOptions>({
  alertVisibility: 'only-unbound-fields',
  callOutVisibility: 'invisible',
});

function ValidationOptionsProvider<TFieldValues extends FieldValues = FieldValues>({
  children,
  ...validationOptions
}: PropsWithChildren<ValidationOptionsProviderProps<TFieldValues>>) {
  // Get parent options to override
  const parentOptions = useValidationOptionsContext();

  return (
    <ValidationOptionsContext.Provider
      value={{
        ...parentOptions,
        ...validationOptions,
      }}
    >
      {children}
    </ValidationOptionsContext.Provider>
  );
}

export default ValidationOptionsProvider;
