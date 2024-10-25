import { useEffect, useMemo } from 'react';
import { useFormState, useWatch } from 'react-hook-form';

import debounce from 'lodash.debounce';

interface AutoSearchProps {
  onValuesChange: () => void;
  delay?: number;
}

function AutoSearch({ onValuesChange, delay = 500 }: AutoSearchProps) {
  const values = useWatch();
  const { isDirty } = useFormState();

  const lazyOnChange = useMemo(() => debounce(onValuesChange, delay), []);

  useEffect(() => {
    if (isDirty) {
      lazyOnChange();
    }
  }, [values, isDirty]);
  return null;
}

export default AutoSearch;
