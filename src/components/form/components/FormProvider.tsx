import { PropsWithChildren } from 'react';
import { FieldValues, FormProvider as RHFProvider } from 'react-hook-form';

import { UseFormReturn, ValidationOptions } from '../hooks/useForm';
import ValidationOptionsProvider from './ValidationOptionsProvider';

/* -------------------------------------------------------------------------- */
/*                                    Types                                   */
/* -------------------------------------------------------------------------- */

export interface FormInstanceProps<TFieldValues extends FieldValues> {
  form: UseFormReturn<TFieldValues>;
}

export interface FormProviderProps<TFieldValues extends FieldValues = FieldValues>
  extends FormInstanceProps<TFieldValues> {
  validationOptions?: ValidationOptions<TFieldValues>;
}

/**
 * Form provider to convey extra form props to spread thru form items
 */
function FormProvider<TFieldValues extends FieldValues>({
  children,
  form,
  validationOptions,
}: PropsWithChildren<FormProviderProps<TFieldValues>>) {
  /* --------------------------------- Render --------------------------------- */

  return (
    <RHFProvider {...form}>
      <ValidationOptionsProvider {...validationOptions}>{children}</ValidationOptionsProvider>
    </RHFProvider>
  );
}

export default FormProvider;
