import { useEffect, useMemo, useRef } from 'react';
import { useFormState, useWatch } from 'react-hook-form';

import debounce from 'lodash.debounce';

interface AutoSearchProps {
  onValuesChange: () => void;
  delay?: number;
}

function AutoSearch({ onValuesChange, delay = 500 }: AutoSearchProps) {
  const values = useWatch();
  const { isDirty } = useFormState();
  const isTouchedOrDirtyRef = useRef<boolean>(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const lazyOnChange = useMemo(() => debounce(onValuesChange, delay), []);

  useEffect(() => {
    if (isDirty || isTouchedOrDirtyRef.current) {
      lazyOnChange();
      isTouchedOrDirtyRef.current = true;
    }
  }, [values, isDirty, lazyOnChange]);
  return null;
}

export default AutoSearch;
