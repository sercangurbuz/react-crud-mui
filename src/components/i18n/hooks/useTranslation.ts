import { useTranslation as useOrjinalTranslation } from 'react-i18next';

import i18n from '..';

function useTranslation() {
  return useOrjinalTranslation('coreui', { i18n });
}

export default useTranslation;
