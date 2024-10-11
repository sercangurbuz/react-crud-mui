import { FieldValues } from 'react-hook-form';

import NumberInput, { NumberInputProps } from '../../number-input/NumberInput';
import Field, { ControlCommonProps } from '../Field';

export interface FormNumberInputProps<TFieldValues extends FieldValues = FieldValues>
  extends Omit<NumberInputProps, 'name'>,
    ControlCommonProps<TFieldValues> {}

function FormNumberInput<TFieldValues extends FieldValues = FieldValues>({
  name,
  fieldProps,
  ...inputProps
}: FormNumberInputProps<TFieldValues>) {
  return (
    <Field
      name={name}
      render={(field, { invalid, error }) => (
        <NumberInput
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

export default FormNumberInput;
