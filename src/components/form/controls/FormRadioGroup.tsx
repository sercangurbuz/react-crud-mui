import { FieldValues } from 'react-hook-form';

import {
  FormControlLabel,
  RadioGroupProps as MuiRadioGroupProps,
  Radio,
  RadioGroup,
  styled,
} from '@mui/material';

import { FormControlProps } from '../components/FormControl';
import Field, { ControlCommonProps } from '../Field';

/* -------------------------------------------------------------------------- */
/*                                    Types                                   */
/* -------------------------------------------------------------------------- */

export type RadioGroupData = {
  value: string | number;
  label: string;
};

export interface FormRadioGroupProps<TFieldValues extends FieldValues = FieldValues>
  extends Omit<MuiRadioGroupProps, 'name'>,
    ControlCommonProps<TFieldValues>,
    FormControlProps {
  data?: RadioGroupData[];
  disabled?: boolean;
}

/* -------------------------------------------------------------------------- */
/*                                   Styled                                   */
/* -------------------------------------------------------------------------- */

export const StyledFormControlLabel = styled(FormControlLabel)({
  '& .MuiTypography-root': { fontSize: 14, fontWeight: 500 },
});

function FormRadioGroup<TFieldValues extends FieldValues = FieldValues>({
  name,
  label,
  helperText,
  placement = 'bottom',
  fieldProps,
  disabled,
  data,
  ...radioGroupProps
}: FormRadioGroupProps<TFieldValues>) {
  return (
    <Field
      name={name}
      formControlProps={{
        label,
        helperText,
        placement,
      }}
      render={(field) => (
        <RadioGroup
          row
          {...radioGroupProps}
          {...field}
          onChange={(e, value) => {
            field.onChange(value);
            radioGroupProps?.onChange?.(e, value);
          }}
        >
          {data?.map(({ label, value }) => (
            <StyledFormControlLabel
              value={value}
              key={value}
              control={<Radio />}
              label={label}
              disabled={disabled}
            />
          ))}
        </RadioGroup>
      )}
      {...fieldProps}
    />
  );
}

export default FormRadioGroup;
