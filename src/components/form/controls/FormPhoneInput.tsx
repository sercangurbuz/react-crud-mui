import { FieldValues } from 'react-hook-form';

import PhoneInput, { PhoneInputProps } from '../../phone-input/PhoneInput';
import Field, { ControlCommonProps } from '../Field';

export interface FormPhoneInputProps<TFieldValues extends FieldValues = FieldValues>
  extends Omit<PhoneInputProps, 'name'>,
    ControlCommonProps<TFieldValues> {}

function FormPhoneInput<TFieldValues extends FieldValues = FieldValues>({
  name,
  fieldProps,
  disabled,
  formControlProps,
  ...inputProps
}: FormPhoneInputProps<TFieldValues>) {
  return (
    <Field
      name={name}
      render={(field, { invalid, error }) => (
        <PhoneInput
          sx={{
            width: '100%',
          }}
          {...inputProps}
          {...field}
          error={invalid}
          helperText={error?.message}
          onChange={(e) => {
            field.onChange(e.inputValue ? e.phone : e.inputValue);
            inputProps?.onChange?.(e);
          }}
        />
      )}
      disabled={disabled}
      formControlProps={formControlProps}
      {...fieldProps}
    />
  );
}

export default FormPhoneInput;
