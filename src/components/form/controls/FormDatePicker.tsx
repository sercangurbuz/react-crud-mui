import { FieldValues } from 'react-hook-form';

import type { StandardTextFieldProps } from '@mui/material/TextField';
import { DatePicker, DatePickerProps } from '@mui/x-date-pickers/DatePicker';
import { Dayjs } from 'dayjs';

import { parseDate } from '../../misc';
import Field, { ControlCommonProps } from '../Field';

export type FormDatePickerProps<TFieldValues extends FieldValues = FieldValues> = Partial<
  DatePickerProps<Dayjs>
> &
  Pick<StandardTextFieldProps, 'size'> &
  ControlCommonProps<TFieldValues> & {
    allowClear?: boolean;
  };

function FormDatePicker<TFieldValues extends FieldValues = FieldValues>({
  name,
  fieldProps,
  slotProps,
  autoFocus,
  size,
  disabled,
  allowClear = true,
  formControlProps,
  ...dateProps
}: FormDatePickerProps<TFieldValues>) {
  return (
    <Field
      name={name}
      render={(field, { invalid, error }) => (
        <DatePicker
          {...dateProps}
          {...field}
          value={parseDate(field.value)}
          onChange={(e, c) => {
            field.onChange(e);
            dateProps?.onChange?.(e, c);
          }}
          slotProps={{
            textField: {
              ...slotProps?.textField,
              size,
              fullWidth: true,
              autoFocus,
              error: invalid,
              helperText: error?.message,
            },
            field: { clearable: allowClear },
          }}
        />
      )}
      disabled={disabled}
      formControlProps={formControlProps}
      {...fieldProps}
    />
  );
}

export default FormDatePicker;
