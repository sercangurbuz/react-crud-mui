import React from 'react';
import { FieldValues } from 'react-hook-form';

import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import RadioGroup, { RadioGroupProps } from '@mui/material/RadioGroup';
import { styled } from '@mui/material/styles';

import { FormControlProps } from '../components/FormControl';
import Field, { ControlCommonProps } from '../Field';

/* -------------------------------------------------------------------------- */
/*                                    Types                                   */
/* -------------------------------------------------------------------------- */

export type RadioGroupData = {
  value: string | number;
  label: React.ReactNode;
};

export interface FormRadioGroupProps<TFieldValues extends FieldValues = FieldValues>
  extends Omit<RadioGroupProps, 'name'>,
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
  placement = 'top',
  fieldProps,
  disabled,
  formControlProps,
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
        ...formControlProps,
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
