import { FieldValues, useFormContext } from 'react-hook-form';

import { UseFormReturn } from './useForm';

function useParentForm<TParentFieldValues extends FieldValues = FieldValues>() {
  const { parentForm } = useFormContext() as UseFormReturn<FieldValues, TParentFieldValues>;
  return parentForm;
}

export default useParentForm;
