import React from 'react';

import { TextField, TextFieldProps } from '@mui/material';
import capitalize from 'lodash.capitalize';

export type CaseType = 'firstUpper' | 'upperCase' | 'lowerCase' | 'normal';

export interface InputProps extends TextFieldProps<'standard'> {
  caseType?: CaseType;
}

function Input({ caseType, ...inputProps }: InputProps) {
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
      onChange={(e) => {
        setCase(e);
        inputProps.onChange?.(e);
      }}
    />
  );
}

export default Input;
