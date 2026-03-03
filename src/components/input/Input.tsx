import React, { forwardRef, Ref, useMemo } from 'react';

import InputAdornment from '@mui/material/InputAdornment';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import capitalize from 'lodash.capitalize';

import useFloatingLabelProps from './hooks/useFloatingLabelProps';

export type CaseType = 'firstUpper' | 'upperCase' | 'lowerCase' | 'normal';

export interface InputProps extends TextFieldProps<'standard'> {
  caseType?: CaseType;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getRef?: Ref<any>;
  showCharacterCount?: boolean;
}

function Input({ caseType, getRef, value, onBlur, onFocus, showCharacterCount, ...inputProps }: InputProps) {
  const setCase = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const value = e.target.value;
    switch (caseType) {
      case 'firstUpper':
        e.target.value = value.split(' ').map(capitalize).join(' ');
        break;
      case 'upperCase':
        e.target.value = value.toUpperCase();
        break;
      case 'lowerCase':
        e.target.value = value.toLowerCase();
        break;
      default:
        break;
    }
  };

  const floatingLabelProps = useFloatingLabelProps({ value, onBlur, onFocus });

  const maxLength = inputProps.inputProps?.maxLength;

  const characterCount = useMemo(() => {
    if (!showCharacterCount || !maxLength) return null;
    
    const currentLength = typeof value === 'string' ? value.length : 0;
    const remaining = maxLength - currentLength;
    
    return (
      <InputAdornment position="end">
        <Typography
          variant="caption"
          color={remaining < 0 ? 'error' : remaining < maxLength * 0.1 ? 'warning' : 'textSecondary'}
        >
          {remaining}
        </Typography>
      </InputAdornment>
    );
  }, [showCharacterCount, maxLength, value]);

  return (
    <TextField
      {...inputProps}
      {...floatingLabelProps}
      value={value}
      ref={getRef}
      onChange={(e) => {
        setCase(e);
        inputProps.onChange?.(e);
      }}
      InputProps={{
        ...inputProps.InputProps,
        endAdornment: characterCount || inputProps.InputProps?.endAdornment,
      }}
    />
  );
}

export default forwardRef<typeof Input, InputProps>((props, ref) => (
  <Input {...props} getRef={ref} />
));
