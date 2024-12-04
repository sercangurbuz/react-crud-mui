import { FieldValues } from 'react-hook-form';

import PhoneInput, { PhoneInputProps } from '../../phone-input/PhoneInput';
import FieldError from '../components/FieldError';
import Field, { ControlCommonProps } from '../Field';

export interface FormPhoneInputProps<TFieldValues extends FieldValues = FieldValues>
  extends Omit<PhoneInputProps, 'name'>,
    ControlCommonProps<TFieldValues> {}

function FormPhoneInput<TFieldValues extends FieldValues = FieldValues>({
  name,
  fieldProps,
  disabled,
  ...inputProps
}: FormPhoneInputProps<TFieldValues>) {
  return (
    <Field
      name={name}
      render={(field, { invalid, error, isTouched }) => (
        <PhoneInput
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
        />
      )}
      disabled={disabled}
      {...fieldProps}
    />
  );
}

export default FormPhoneInput;
