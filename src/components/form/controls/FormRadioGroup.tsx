import React from 'react';
import { FieldValues } from 'react-hook-form';

import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import RadioGroup, { RadioGroupProps } from '@mui/material/RadioGroup';
import { styled } from '@mui/material/styles';

import useTranslation from '../../i18n/hooks/useTranslation';
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
  showAllOption?: boolean;
  showAllOptionValue?: string | number | null;
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
  showAllOption,
  showAllOptionValue = null,
  disabled,
  formControlProps,
  data,
  ...radioGroupProps
}: FormRadioGroupProps<TFieldValues>) {
  const { t } = useTranslation();

  return (
    <Field
      name={name}
      formControlProps={{
        label,
        helperText,
        placement,
        ...formControlProps,
      }}
      disabled={disabled}
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
          {showAllOption && (
            <StyledFormControlLabel
              value={showAllOptionValue}
              control={<Radio />}
              label={t('all')}
            />
          )}
          {data?.map(({ label, value }) => (
            <StyledFormControlLabel
              value={value}
              key={value}
              control={<Radio />}
              label={label}
              disabled={field?.disabled}
            />
          ))}
        </RadioGroup>
      )}
      {...fieldProps}
    />
  );
}

export default FormRadioGroup;
