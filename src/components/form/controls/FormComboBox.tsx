import { FieldValues } from 'react-hook-form';

import ComboBox, { ComboBoxProps, CreatableModel } from '../../combobox/ComboBox';
import Field, { ControlCommonProps } from '../Field';

export interface FormComboBoxProps<
  T extends CreatableModel = CreatableModel,
  Creatable extends boolean = false,
  TFieldValues extends FieldValues = FieldValues,
> extends Omit<ComboBoxProps<T, Creatable>, 'name'>,
    ControlCommonProps<TFieldValues> {}

function FormComboBox<
  T extends CreatableModel = CreatableModel,
  Creatable extends boolean = false,
  TFieldValues extends FieldValues = FieldValues,
>({
  name,
  fieldProps,
  disabled,
  formControlProps,
  ...comboBoxProps
}: FormComboBoxProps<T, Creatable, TFieldValues>) {
  return (
    <Field
      name={name}
      render={(field, { invalid, error }) => (
        <ComboBox<T, Creatable>
          {...comboBoxProps}
          {...field}
          error={invalid}
          helperText={error?.message}
          onChange={(e, value, reason, details) => {
            if (reason === 'createOption' && typeof value === 'string') {
              return;
            }

            comboBoxProps?.onChange?.(e, value, reason, details);
            field.onChange(value);
          }}
          onBlur={(e) => {
            comboBoxProps?.onBlur?.(e);
          }}
        />
      )}
      disabled={disabled}
      formControlProps={formControlProps}
      {...fieldProps}
    />
  );
}

export default FormComboBox;
