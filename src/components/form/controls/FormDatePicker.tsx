import { FieldValues } from 'react-hook-form';

import { StandardTextFieldProps, TextField } from '@mui/material';
import {
  DatePicker as MuiDatePicker,
  DatePickerProps as MuiDatePickerProps,
} from '@mui/x-date-pickers';
import { Dayjs } from 'dayjs';

import Field, { ControlCommonProps } from '../Field';

export type FormDatePickerProps<TFieldValues extends FieldValues = FieldValues> = Partial<
  MuiDatePickerProps<Dayjs>
> &
  Pick<StandardTextFieldProps, 'size'> &
  ControlCommonProps<TFieldValues>;

function FormDatePicker<TFieldValues extends FieldValues = FieldValues>({
  name,
  fieldProps,
  slotProps,
  autoFocus,
  size,
  ...dateProps
}: FormDatePickerProps<TFieldValues>) {
  return (
    <Field
      name={name}
      render={(field, { invalid, error }) => (
        <MuiDatePicker
          {...dateProps}
          {...field}
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
          }}
        />
      )}
      {...fieldProps}
    />
  );
}

export default FormDatePicker;
