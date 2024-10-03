import { AxiosRequestHeaders } from 'axios';

import useTranslation from '../i18n/hooks/useTranslation';
import useSettings from '../settings-provider/hooks/useSettings';

function useCommonHeaders() {
  const { i18n } = useTranslation();
  const { requestCommonHeaders } = useSettings();

  return {
    CurrentCulture: i18n.language,
    ...requestCommonHeaders,
  } as unknown as AxiosRequestHeaders;
}

export default useCommonHeaders;
