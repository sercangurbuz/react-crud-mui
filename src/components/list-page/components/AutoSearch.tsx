import { useEffect, useMemo, useRef } from 'react';
import { useFormState, useWatch } from 'react-hook-form';

import debounce from 'lodash.debounce';

import { useFormStatesContext } from '../../form/hooks';

interface AutoSearchProps {
  onValuesChange: () => void;
  delay?: number;
}

function AutoSearch({ onValuesChange, delay = 500 }: AutoSearchProps) {
  const values = useWatch();
  const { isDirty } = useFormState();
  const { isTouched } = useFormStatesContext();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const lazyOnChange = useMemo(() => debounce(onValuesChange, delay), []);

  useEffect(() => {
    if (isDirty && isTouched) {
      lazyOnChange();
    }
  }, [values, isDirty, lazyOnChange, isTouched]);
  return null;
}

export default AutoSearch;
