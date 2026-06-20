import { FieldValues } from 'react-hook-form';

import DateRangePicker, {
  DateRangePickerProps,
  DateRangeValue,
} from '../../date-range-picker/DateRangePicker';
import { parseDate } from '../../misc';
import Field, { ControlCommonProps } from '../Field';

/* -------------------------------------------------------------------------- */
/*                                    Types                                   */
/* -------------------------------------------------------------------------- */

export interface FormDateRangePickerProps<TFieldValues extends FieldValues = FieldValues>
  extends Omit<DateRangePickerProps, 'value' | 'onChange' | 'invalid' | 'error'>,
    ControlCommonProps<TFieldValues> {
  disabled?: boolean;
}

/* -------------------------------------------------------------------------- */
/*                                 Component                                  */
/* -------------------------------------------------------------------------- */

function FormDateRangePicker<TFieldValues extends FieldValues = FieldValues>({
  name,
  fieldProps,
  disabled,
  formControlProps,
  ...pickerProps
}: FormDateRangePickerProps<TFieldValues>) {
  return (
    <Field
      name={name}
      render={(field, { invalid, error }) => {
        const raw = field.value as [unknown, unknown] | null | undefined;
        const value: DateRangeValue = [
          parseDate(raw?.[0] as string | null | undefined),
          parseDate(raw?.[1] as string | null | undefined),
        ];
        return (
          <DateRangePicker
            {...pickerProps}
            value={value}
            onChange={(range) => field.onChange(range)}
            invalid={invalid}
            disabled={disabled}
            error={error?.message}
          />
        );
      }}
      disabled={disabled}
      formControlProps={formControlProps}
      {...fieldProps}
    />
  );
}

export default FormDateRangePicker;
