import dayjs, { Dayjs } from 'dayjs';
import { z } from 'zod';

import i18n from '../../i18n';

const dateSchema = z.lazy(() =>
  z.union([
    z.instanceof(dayjs as unknown as typeof Dayjs, {
      message: i18n.t('common:invalid_date'),
    }),
    z.string(),
  ]),
);

export default dateSchema;
