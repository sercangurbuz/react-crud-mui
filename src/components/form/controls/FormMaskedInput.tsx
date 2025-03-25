import { FieldValues } from 'react-hook-form';

import MaskedInput, { MaskedInputProps } from '../../masked-input/MaskedInput';
import isNil from '../../misc/isNil';
import Field, { ControlCommonProps } from '../Field';

export interface FormMaskedInputProps<TFieldValues extends FieldValues = FieldValues>
  extends Omit<MaskedInputProps, 'name'>,
    ControlCommonProps<TFieldValues> {}

function FormMaskedInput<TFieldValues extends FieldValues = FieldValues>({
  name,
  disabled,
  formControlProps,
  fieldProps,
  helperText,
  ...inputProps
}: FormMaskedInputProps<TFieldValues>) {
  return (
    <Field
      name={name}
      render={(field, { invalid, error }) => (
        <MaskedInput
          {...inputProps}
          {...field}
          /**
           * ReactInputMask component is not friendly with nullish values
           */
          value={isNil(field.value) ? '' : field.value}
          error={invalid}
          helperText={error?.message || helperText}
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
      formControlProps={formControlProps}
      {...fieldProps}
    />
  );
}

export default FormMaskedInput;
