import { useEffect } from 'react';
import { FieldErrors, FieldValues, useFormState } from 'react-hook-form';

interface FormValuesTrackerProps<TModel extends FieldValues> {
  onErrorsChange(errors: FieldErrors<TModel>, isValid?: boolean): void;
}

function FormErrorsTracker<TModel extends FieldValues>({
  onErrorsChange,
}: FormValuesTrackerProps<TModel>) {
  const { errors, isValid } = useFormState<TModel>();

  useEffect(() => {
    onErrorsChange(errors, isValid);
  }, [errors, onErrorsChange, isValid]);

  return null;
}

export default FormErrorsTracker;
