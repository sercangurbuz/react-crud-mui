import dayjs, { Dayjs } from 'dayjs';

function parseDate(date: Dayjs | string | Date | null | undefined) {
  return dayjs.isDayjs(date) ? date : date ? dayjs(date) : null;
}

export default parseDate;
