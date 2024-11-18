import { useEffect, useRef } from 'react';

import useTranslation from './useTranslation';

interface UseLangChangeCallback {
  (lng: string): void;
}

function useLangWatch(callBack: UseLangChangeCallback) {
  const { i18n } = useTranslation();
  const prevLang = useRef(i18n.language);

  useEffect(() => {
    if (prevLang.current !== i18n.language) {
      callBack(i18n.language);
      prevLang.current = i18n.language;
    }
  }, [callBack, i18n.language]);
}

export default useLangWatch;
