import { FieldValues } from 'react-hook-form';

import { TextField, TextFieldProps } from '@mui/material';

import FieldError from '../components/FieldError';
import Field, { ControlCommonProps } from '../Field';

export interface FormInputProps<TFieldValues extends FieldValues = FieldValues>
  extends Omit<TextFieldProps<'standard'>, 'name'>,
    ControlCommonProps<TFieldValues> {}

function FormInput<TFieldValues extends FieldValues = FieldValues>({
  name,
  fieldProps,
  disabled,
  ...inputProps
}: FormInputProps<TFieldValues>) {
  return (
    <Field
      name={name}
      render={(field, { invalid, error, isTouched }) => (
        <TextField
          sx={{
            width: '100%',
          }}
          {...inputProps}
          {...field}
          error={isTouched && invalid}
          helperText={<FieldError message={error?.message} />}
          onChange={(e) => {
            field.onChange(e);
            inputProps?.onChange?.(e);
          }}
          onBlur={(e) => {
            field.onBlur();
            inputProps?.onBlur?.(e);
          }}
        />
      )}
      disabled={disabled}
      {...fieldProps}
    />
  );
}

export default FormInput;
