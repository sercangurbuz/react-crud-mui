import React, { forwardRef, Ref } from 'react';

import { TextField, TextFieldProps } from '@mui/material';
import capitalize from 'lodash.capitalize';

export type CaseType = 'firstUpper' | 'upperCase' | 'lowerCase' | 'normal';

export interface InputProps extends TextFieldProps<'standard'> {
  caseType?: CaseType;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getRef?: Ref<any>;
}

function Input({ caseType, getRef, ...inputProps }: InputProps) {
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

  return (
    <TextField
      {...inputProps}
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
