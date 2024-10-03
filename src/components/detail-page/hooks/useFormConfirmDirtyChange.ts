import { useCallback, useRef } from 'react';

import useTranslation from '../../i18n/hooks/useTranslation';
import { CloseReason } from '../../page/Page';

interface UseFormConfirmDirtyChangeOptions {
  /**
   * Whether to leave modal without saving when form is dirty,default true
   */
  enabled?: boolean;

  onClose?: (reason?: CloseReason) => void;
}

/**
 *  Confirm dirty change either leave or stay on form
 */
function useFormConfirmDirtyChange({ onClose, enabled }: UseFormConfirmDirtyChangeOptions) {
  /* -------------------------------------------------------------------------- */
  /*                                    Hooks                                   */
  /* -------------------------------------------------------------------------- */

  const { t } = useTranslation();
  const formDirtyRef = useRef<boolean | null>(null);

  const setFormDirtyChange = useCallback((isDirty: boolean) => {
    formDirtyRef.current = isDirty;
  }, []);

  const handleCloseEvent = (reason?: CloseReason) => {
    if (enabled && formDirtyRef.current && reason !== 'action') {
      if (window.confirm(t('promptunsavedchanges'))) {
        onClose?.(reason);
      }
      return;
    }
    onClose?.(reason);
  };

  return { handleCloseEvent, setFormDirtyChange };
}

export default useFormConfirmDirtyChange;
