import { useEffect } from 'react';
import { useFormState, useWatch } from 'react-hook-form';

import { useDebounce } from '../../../hooks';

interface AutoSaveProps {
  onValuesChange: () => void;
  delay?: number;
}

function AutoSave({ onValuesChange, delay = 500 }: AutoSaveProps) {
  const values = useWatch();
  const { isDirty } = useFormState();
  const debouncedValue = useDebounce(values, delay);

  useEffect(() => {
    if (isDirty) {
      onValuesChange();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValue]);
  return null;
}

export default AutoSave;
