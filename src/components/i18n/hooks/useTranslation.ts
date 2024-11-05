import { useTranslation as useOrjinalTranslation } from 'react-i18next';

import i18nInstance from '..';

function useTranslation() {
  return useOrjinalTranslation('coreui', { i18n: i18nInstance });
}

export default useTranslation;
