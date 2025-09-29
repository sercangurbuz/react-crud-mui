import { forwardRef, Ref } from 'react';

import { BoxProps } from '@mui/system/Box';
import dayjs, { Dayjs } from 'dayjs';

import useSettings from '../crud-mui-provider/hooks/useSettings';
import { FlexBox } from '../flexbox';
import Calendar from '../icons/sidebar/Calendar';

/* -------------------------------------------------------------------------- */
/*                                    Types                                   */
/* -------------------------------------------------------------------------- */

export interface DateFormatProps extends BoxProps {
  date?: Dayjs | Date | string;
  format?: string;
  stringFormat?: string;
  /**
   * Enable time
   */
  enableTime?: boolean;
  /**
   * Enable mount view
   */
  isMonthView?: boolean;
  /**
   * Show calendar icon or not
   */
  showIcon?: boolean;
  /**
   * Convert utc time to local time
   */
  convertToLocal?: boolean;
  /**
   * Whether to show undefined message or not
   */
  showUndefinedMessage?: boolean;
  /**
   * Message to show when date is undefined
   */
  unDefinedMessage?: string;
}

/* -------------------------------------------------------------------------- */
/*                            DateFormat Component                            */
/* -------------------------------------------------------------------------- */

function DateFormat(
  {
    date,
    enableTime = false,
    stringFormat,
    isMonthView = false,
    showIcon = false,
    convertToLocal,
    format: customFormat,
    showUndefinedMessage = false,
    unDefinedMessage = '-',
    ...rest
  }: DateFormatProps,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ref: Ref<any>,
) {
  const { dateFormat, dateTimeFormat, monthFormat, convertToLocaleDateTime } = useSettings();

  if (!date) {
    return showUndefinedMessage ? unDefinedMessage : null;
  }

  const format =
    customFormat ?? (isMonthView ? monthFormat : enableTime ? dateTimeFormat : dateFormat);

  let dayJsDate;
  let toLocale = convertToLocaleDateTime;

  if (convertToLocal !== undefined && convertToLocal !== null) {
    toLocale = convertToLocal;
  }

  if (toLocale) {
    dayJsDate = dayjs.utc(date, stringFormat).local();
  } else {
    dayJsDate = dayjs(date, stringFormat);
  }

  const formattedDate = dayJsDate.format(customFormat ?? format);

  return (
    <FlexBox alignItems="center" title={formattedDate} {...rest} ref={ref} gap={1}>
      {showIcon && <Calendar sx={{ color: 'currentColor' }} />} {formattedDate}
    </FlexBox>
  );
}

export default forwardRef(DateFormat);
