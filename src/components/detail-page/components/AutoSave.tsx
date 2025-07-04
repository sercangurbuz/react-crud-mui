import { useEffect, useMemo } from 'react';
import { useFormState, useWatch } from 'react-hook-form';

import { debounce } from 'lodash';

import { useFormStatesContext } from '../../form/hooks';

interface AutoSaveProps extends AutoSaveOptions {
  onAutoSave: () => void;
}

export interface AutoSaveOptions {
  delay?: number;
}

function AutoSave({ onAutoSave, delay }: AutoSaveProps) {
  const values = useWatch();
  const { isDirty, isValid } = useFormState();
  //const debouncedValue = useDebounce(values, delay);
  const { isTouched } = useFormStatesContext();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const lazyOnChange = useMemo(() => debounce(onAutoSave, delay), []);

  useEffect(() => {
    if (isTouched && isDirty && isValid) {
      lazyOnChange();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values, isDirty, isValid, isTouched]);
  return null;
}

export default AutoSave;
