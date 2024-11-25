import { forwardRef, Ref } from 'react';

import { BoxProps } from '@mui/system/Box';
import dayjs, { Dayjs } from 'dayjs';

import { FlexBox } from '../flexbox';
import Calendar from '../icons/sidebar/Calendar';
import useSettings from '../crud-mui-provider/hooks/useSettings';

/* -------------------------------------------------------------------------- */
/*                                    Types                                   */
/* -------------------------------------------------------------------------- */

export interface DateFormatProps extends BoxProps {
  date?: Dayjs | Date;
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
}

/* -------------------------------------------------------------------------- */
/*                            DateFormat Component                            */
/* -------------------------------------------------------------------------- */

function DateFormat(
  {
    date,
    enableTime = false,
    isMonthView = false,
    showIcon = true,
    convertToLocal,
    ...rest
  }: DateFormatProps,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ref: Ref<any>,
) {
  const {
    dateFormat,
    dateTimeFormat,
    dateLongFormat,
    dateTimeLongFormat,
    monthFormat,
    convertToLocaleDateTime,
  } = useSettings();

  if (!date) {
    return null;
  }

  const format = isMonthView ? monthFormat : enableTime ? dateTimeFormat : dateFormat;

  let displayDate;
  let toLocale = convertToLocaleDateTime;

  if (convertToLocal !== undefined && convertToLocal !== null) {
    toLocale = convertToLocal;
  }

  if (toLocale) {
    displayDate = dayjs.utc(date).local();
  } else {
    displayDate = dayjs(date);
  }

  const formattedDate = displayDate.format(format);
  const tooltip = isMonthView
    ? formattedDate
    : displayDate.format(enableTime ? dateTimeLongFormat : dateLongFormat);

  return (
    <FlexBox alignItems="center" title={tooltip} {...rest} ref={ref} gap={1}>
      {showIcon && <Calendar sx={{ color: 'text.secondary' }} />} {formattedDate}
    </FlexBox>
  );
}

export default forwardRef(DateFormat);
