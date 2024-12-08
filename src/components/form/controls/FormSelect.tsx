import { FieldValues } from 'react-hook-form';

import Select, { SelectProps } from '../../select/Select';
import Field, { ControlCommonProps } from '../Field';

export interface FormSelectProps<
  T extends FieldValues,
  TFieldValues extends FieldValues = FieldValues,
> extends Omit<SelectProps<T>, 'name'>,
    ControlCommonProps<TFieldValues> {}

function FormSelect<T extends FieldValues, TFieldValues extends FieldValues = FieldValues>({
  name,
  fieldProps,
  disabled,
  ...selectProps
}: FormSelectProps<T, TFieldValues>) {
  return (
    <Field
      name={name}
      render={(field, { invalid, error }) => (
        <Select<T>
          {...selectProps}
          {...field}
          id={name}
          error={invalid}
          helperText={error?.message}
          onChange={(e, child) => {
            field.onChange(e.target.value);
            selectProps?.onChange?.(e, child);
          }}
        />
      )}
      disabled={disabled}
      {...fieldProps}
    />
  );
}

export default FormSelect;
