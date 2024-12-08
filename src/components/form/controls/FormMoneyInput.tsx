import { FieldValues } from 'react-hook-form';

import MoneyInput, { MoneyInputProps } from '../../money-input/MoneyInput';
import Field, { ControlCommonProps } from '../Field';

export interface FormMoneyInputProps<TFieldValues extends FieldValues = FieldValues>
  extends Omit<MoneyInputProps, 'name'>,
    ControlCommonProps<TFieldValues> {}

function FormMoneyInput<TFieldValues extends FieldValues = FieldValues>({
  name,
  fieldProps,
  disabled,
  ...inputProps
}: FormMoneyInputProps<TFieldValues>) {
  return (
    <Field
      name={name}
      render={(field, { invalid, error }) => (
        <MoneyInput
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
      disabled={disabled}
      {...fieldProps}
    />
  );
}

export default FormMoneyInput;
