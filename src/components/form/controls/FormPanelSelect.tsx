import { FieldValues } from 'react-hook-form';

import PanelSelect, { PanelSelectProps } from '../../panel-select/PanelSelect';
import { FormControlProps } from '../components/FormControl';
import Field, { ControlCommonProps } from '../Field';

/* -------------------------------------------------------------------------- */
/*                                    Types                                   */
/* -------------------------------------------------------------------------- */

export interface FormPanelSelectProps<TFieldValues extends FieldValues = FieldValues>
  extends Omit<PanelSelectProps, 'name'>,
    ControlCommonProps<TFieldValues>,
    FormControlProps {}

function FormPanelSelect<TFieldValues extends FieldValues = FieldValues>({
  name,
  label,
  helperText,
  placement = 'top',
  fieldProps,
  formControlProps,
  ...panelSelectProps
}: FormPanelSelectProps<TFieldValues>) {
  return (
    <Field
      name={name}
      formControlProps={{
        label,
        helperText,
        placement,
        disabled: panelSelectProps.disabled,
        ...formControlProps,
      }}
      render={(field) => (
        <PanelSelect
          {...panelSelectProps}
          {...field}
          onChange={(value) => {
            field.onChange(value);
            panelSelectProps?.onChange?.(value);
          }}
        />
      )}
      {...fieldProps}
    />
  );
}

export default FormPanelSelect;
