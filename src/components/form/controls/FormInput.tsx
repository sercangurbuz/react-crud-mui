import { FieldValues } from 'react-hook-form';

import { TextField, TextFieldProps } from '@mui/material';

import Field, { ControlCommonProps } from '../Field';

export interface FormInputProps<TFieldValues extends FieldValues = FieldValues>
  extends Omit<TextFieldProps<'standard'>, 'name'>,
    ControlCommonProps<TFieldValues> {}

function FormInput<TFieldValues extends FieldValues = FieldValues>({
  name,
  fieldProps,
  ...inputProps
}: FormInputProps<TFieldValues>) {
  return (
    <Field
      name={name}
      render={(field, { invalid, error }) => (
        <TextField
          sx={{
            width: '100%',
          }}
          {...inputProps}
          {...field}
          error={invalid}
          helperText={error?.message}
          onChange={(e) => {
            field.onChange(e);
            inputProps?.onChange?.(e);
          }}
        />
      )}
      {...fieldProps}
    />
  );
}

export default FormInput;
