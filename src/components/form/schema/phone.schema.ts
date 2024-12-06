import { isValidPhoneNumber, parsePhoneNumberWithError } from 'libphonenumber-js';
import { z } from 'zod';

import i18nInstance from '../../i18n';

const phoneSchema = z
  .string()
  .refine((args) => {
    if (!args) {
      return true;
    }

    return isValidPhoneNumber(args);
  }, i18nInstance.t('coreui:phone_number_val_message'))
  .transform((value) => {
    if (!value) {
      return value;
    }

    const phone = parsePhoneNumberWithError(value);

    if (phone?.isValid()) {
      return phone.number.toString();
    }

    return null;
  });

export default phoneSchema;
