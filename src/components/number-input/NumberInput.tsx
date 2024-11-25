import { forwardRef, Ref } from 'react';
import { NumericFormat, NumericFormatProps } from 'react-number-format';

import { StandardTextFieldProps, TextField } from '@mui/material';

import useSettings from '../crud-mui-provider/hooks/useSettings';
import { ControlledFormProps } from '../utils';

export type NumberInputProps = Omit<NumericFormatProps<StandardTextFieldProps>, 'onChange'> &
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ControlledFormProps<number | undefined> & { getRef?: Ref<any> };

function NumberInput({ onChange, sx, getRef, ...numberProps }: NumberInputProps) {
  const { decimalSeparator, thousandSeparator } = useSettings();

  return (
    <NumericFormat
      customInput={TextField}
      allowNegative={false}
      decimalScale={0}
      thousandSeparator={thousandSeparator}
      decimalSeparator={decimalSeparator}
      allowedDecimalSeparators={[',']}
      fixedDecimalScale={true}
      getInputRef={getRef}
      sx={{
        '& .MuiInputBase-input': {
          textAlign: 'right',
          fontVariantNumeric: 'tabular-nums',
        },
        ...sx,
      }}
      {...numberProps}
      onValueChange={({ floatValue }) => onChange?.(floatValue ?? 0)}
    />
  );
}

export default forwardRef<typeof NumberInput, NumberInputProps>((props, ref) => (
  <NumberInput {...props} getRef={ref} />
));
