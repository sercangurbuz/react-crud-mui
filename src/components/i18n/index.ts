import { initReactI18next } from 'react-i18next';

import { createInstance } from 'i18next';
import { z } from 'zod';
import { makeZodI18nMap } from 'zod-i18n-map';
import zod_translation_en from 'zod-i18n-map/locales/en/zod.json';
import zod_translation_tr from 'zod-i18n-map/locales/tr/zod.json';

import 'dayjs/locale/tr';
import 'dayjs/locale/en';

import translation_en from './resources/en.json';
import translation_tr from './resources/tr.json';

const i18n = createInstance({
  fallbackLng: 'en',
  resources: {
    tr: {
      coreui: translation_tr,
      zod: zod_translation_tr,
    },
    en: {
      coreui: translation_en,
      zod: zod_translation_en,
    },
  },
}).use(initReactI18next);

i18n.init();

z.setErrorMap(makeZodI18nMap({ t: i18n.t }));

export default i18n;
