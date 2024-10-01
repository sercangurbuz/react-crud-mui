import { FieldValues } from 'react-hook-form';

import { TextField, TextFieldProps } from '@mui/material';

import Field, { ControlCommonProps } from '../Field';

export interface FormTextFieldProps<TFieldValues extends FieldValues = FieldValues>
  extends Omit<TextFieldProps<'standard'>, 'name'>,
    ControlCommonProps<TFieldValues> {}

function FormTextField<TFieldValues extends FieldValues = FieldValues>({
  name,
  label,
  fieldProps,
  ...inputProps
}: FormTextFieldProps<TFieldValues>) {
  return (
    <Field
      name={name}
      render={(field) => (
        <TextField
          {...inputProps}
          {...field}
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
