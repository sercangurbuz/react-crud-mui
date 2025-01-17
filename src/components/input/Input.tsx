import React, { forwardRef, Ref } from 'react';

import TextField, { TextFieldProps } from '@mui/material/TextField';
import capitalize from 'lodash.capitalize';

import useFloatingLabelProps from './hooks/useFloatingLabelProps';

export type CaseType = 'firstUpper' | 'upperCase' | 'lowerCase' | 'normal';

export interface InputProps extends TextFieldProps<'standard'> {
  caseType?: CaseType;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getRef?: Ref<any>;
}

function Input({ caseType, getRef, value, onBlur, onFocus, ...inputProps }: InputProps) {
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
    />
  );
}

export default forwardRef<typeof Input, InputProps>((props, ref) => (
  <Input {...props} getRef={ref} />
));
