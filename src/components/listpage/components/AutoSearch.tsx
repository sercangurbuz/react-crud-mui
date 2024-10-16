import { useEffect } from 'react';
import { FieldValues, useFormState, useWatch } from 'react-hook-form';

import useDebounce from '../../hooks/useDebounce';

interface AutoSearchProps<TFieldValues extends FieldValues> {
  onValuesChange: (values: TFieldValues) => void;
  delay?: number;
}

function AutoSearch<TFieldValues extends FieldValues = FieldValues>({
  onValuesChange,
  delay = 500,
}: AutoSearchProps<TFieldValues>) {
  const values = useWatch<TFieldValues>();
  const { isDirty } = useFormState();
  const debouncedValue = useDebounce(values, delay);

  useEffect(() => {
    if (isDirty) {
      onValuesChange(debouncedValue as TFieldValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValue, isDirty]);
  return null;
}

export default AutoSearch;
