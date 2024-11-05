import { forwardRef, Ref } from 'react';
import { PatternFormat, PatternFormatProps } from 'react-number-format';

import { StandardTextFieldProps, TextField } from '@mui/material';

import { ControlledFormProps } from '../utils';

const DEFAULT_PHONE_FORMAT = '+90 (###) ###-##-##';

export type PhoneInputProps = Omit<
  PatternFormatProps<StandardTextFieldProps>,
  'format' | 'onChange'
> &
  ControlledFormProps<string> & {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getRef?: Ref<any>;
    format?: string;
  };

function PhoneInput({ onChange, ...props }: PhoneInputProps) {
  return (
    <PatternFormat
      mask="_"
      allowEmptyFormatting
      onValueChange={({ value }, e) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
        if (e.source === 'event') {
          onChange?.(value);
        }
      }}
      customInput={TextField}
      getInputRef={props?.getRef}
      format={DEFAULT_PHONE_FORMAT}
      {...props}
      sx={{
        '& .MuiInputBase-input': {
          fontVariantNumeric: 'tabular-nums',
        },
        ...props?.sx,
      }}
    />
  );
}

export default forwardRef<typeof PhoneInput, PhoneInputProps>((props, ref) => (
  <PhoneInput {...props} getRef={ref} />
));
