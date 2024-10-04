import { FieldValues } from 'react-hook-form';

import { Checkbox, CheckboxProps } from '@mui/material';

import { FormControlProps } from '../components/FormControl';
import Field, { ControlCommonProps } from '../Field';

export interface FormCheckboxProps<TFieldValues extends FieldValues = FieldValues>
  extends Omit<CheckboxProps, 'name'>,
    ControlCommonProps<TFieldValues>,
    FormControlProps {}

function FormCheckbox<TFieldValues extends FieldValues = FieldValues>({
  name,
  label,
  helperText,
  placement = 'left',
  fieldProps,
  ...checkBoxProps
}: FormCheckboxProps<TFieldValues>) {
  return (
    <Field
      name={name}
      formControlProps={{
        label,
        helperText,
        placement,
      }}
      render={(field) => (
        <Checkbox
          {...checkBoxProps}
          {...field}
          checked={field.value}
          onChange={(e, checked) => {
            field.onChange(checked);
            checkBoxProps?.onChange?.(e, checked);
          }}
        />
      )}
      {...fieldProps}
    />
  );
}

export default FormCheckbox;
