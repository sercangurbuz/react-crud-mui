import { useEffect } from 'react';
import { FieldValues, useFormState, useWatch } from 'react-hook-form';

interface FormValuesTrackerProps<TModel extends FieldValues> {
  onValuesChange(values: Partial<TModel>): void;
}

function FormValuesTracker<TModel extends FieldValues>({
  onValuesChange,
}: FormValuesTrackerProps<TModel>) {
  const allValues = useWatch<TModel>();
  const { isDirty } = useFormState();

  useEffect(() => {
    if (isDirty) {
      onValuesChange(allValues);
    }
  }, [allValues, isDirty, onValuesChange]);

  return null;
}

export default FormValuesTracker;
