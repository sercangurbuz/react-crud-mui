import { FieldValues } from 'react-hook-form';

import Switch, { SwitchProps } from '@mui/material/Switch';

import { FormControlProps } from '../components/FormControl';
import Field, { ControlCommonProps } from '../Field';

export interface FormSwitchProps<TFieldValues extends FieldValues = FieldValues>
  extends Omit<SwitchProps, 'name'>,
    ControlCommonProps<TFieldValues>,
    FormControlProps {}

function FormSwitch<TFieldValues extends FieldValues = FieldValues>({
  name,
  label,
  helperText,
  placement = 'right',
  labelProps,
  wrapperProps,
  fieldProps,
  disabled,
  ...switchProps
}: FormSwitchProps<TFieldValues>) {
  return (
    <Field
      name={name}
      formControlProps={{
        label,
        helperText,
        placement,
        labelProps,
        wrapperProps,
      }}
      disabled={disabled}
      render={(field) => (
        <Switch
          {...switchProps}
          {...field}
          checked={field.value}
          onChange={(e, checked) => {
            field.onChange(checked);
            switchProps?.onChange?.(e, checked);
          }}
        />
      )}
      {...fieldProps}
    />
  );
}

export default FormSwitch;
