import { useEffect } from 'react';
import { useFormState, useWatch } from 'react-hook-form';

import { useDebounce } from '../../hooks';

interface AutoSaveProps extends AutoSaveOptions {
  onAutoSave: () => void;
}

export interface AutoSaveOptions {
  delay?: number;
}

function AutoSave({ onAutoSave, delay }: AutoSaveProps) {
  const values = useWatch();
  const { isDirty, isValid } = useFormState();
  const debouncedValue = useDebounce(values, delay);

  useEffect(() => {
    if (isDirty && isValid) {
      onAutoSave();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [delay ? debouncedValue : values, isDirty, isValid]);
  return null;
}

export default AutoSave;
