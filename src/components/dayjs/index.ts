import dayjs, { PluginFunc } from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
dayjs.extend(customParseFormat);
dayjs.extend(timezone);
dayjs.extend(advancedFormat);

const tz = dayjs.tz.guess();
dayjs.tz.setDefault(tz);

const JsonPlugin: PluginFunc<object> = (_option, dayjsClass) => {
  // https://github.com/iamkun/dayjs/issues/934#issuecomment-647421012
  dayjsClass.prototype.toJSON = function () {
    return dayjs.tz(this).format();
  };
};

dayjs.extend(JsonPlugin);
