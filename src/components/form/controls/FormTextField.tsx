import { FieldValues } from 'react-hook-form';

import { TextField, TextFieldProps } from '@mui/material';

import Field, { ControlCommonProps } from '../Field';

export interface FormTextFieldProps<TFieldValues extends FieldValues = FieldValues>
  extends Omit<TextFieldProps<'standard'>, 'name'>,
    ControlCommonProps<TFieldValues> {}

function FormTextField<TFieldValues extends FieldValues = FieldValues>({
  name,
  fieldProps,
  ...inputProps
}: FormTextFieldProps<TFieldValues>) {
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

export default FormTextField;
