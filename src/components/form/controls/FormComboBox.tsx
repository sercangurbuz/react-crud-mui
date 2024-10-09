import { FieldValues } from 'react-hook-form';

import ComboBox, { ComboBoxProps, CreatableModel } from '../../combobox/ComboBox';
import Field, { ControlCommonProps } from '../Field';

export interface FormComboBoxProps<
  T extends CreatableModel,
  Creatable extends boolean = false,
  TFieldValues extends FieldValues = FieldValues,
> extends Omit<ComboBoxProps<T, Creatable>, 'name'>,
    ControlCommonProps<TFieldValues> {}

function FormComboBox<
  T extends CreatableModel,
  Creatable extends boolean,
  TFieldValues extends FieldValues,
>({ name, fieldProps, ...comboBoxProps }: FormComboBoxProps<T, Creatable, TFieldValues>) {
  return (
    <Field
      name={name}
      render={(field, { invalid, error }) => (
        <ComboBox
          {...comboBoxProps}
          {...field}
          error={invalid}
          helperText={error?.message}
          onChange={(e, value, reason, details) => {
            field.onChange(value);
            comboBoxProps?.onChange?.(e, value, reason, details);
          }}
        />
      )}
      {...fieldProps}
    />
  );
}

export default FormComboBox;
