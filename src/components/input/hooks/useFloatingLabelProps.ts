import { useEffect, useRef, useState } from 'react';

import { BaseTextFieldProps } from '@mui/material';

function useFloatingLabelProps({
  onBlur,
  onFocus,
  value,
}: Pick<BaseTextFieldProps, 'value' | 'onFocus' | 'onBlur'>) {
  const [shrink, setShrink] = useState(!!value);
  const focusedRef = useRef<boolean | null>(null);

  useEffect(() => {
    if (!focusedRef.current) {
      setShrink(!!value);
    }
  }, [value]);

  return {
    InputLabelProps: { shrink },
    onFocus: (e) => {
      setShrink(true);
      focusedRef.current = true;
      onFocus?.(e);
    },
    onBlur: (e) => {
      focusedRef.current = false;
      setShrink(!!e.target.value);
      onBlur?.(e);
    },
  } as Partial<BaseTextFieldProps>;
}

export default useFloatingLabelProps;
