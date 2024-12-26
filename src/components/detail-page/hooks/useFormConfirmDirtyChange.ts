import { useCallback, useRef } from 'react';

import useTranslation from '../../i18n/hooks/useTranslation';
import { CloseReason } from '../../page/Page';
import { UseFormPromptProps } from './useFormPrompt';

interface UseFormConfirmDirtyChangeOptions extends UseFormPromptProps {
  onClose?: (reason?: CloseReason) => void;
}

/**
 *  Confirm dirty change either leave or stay on form
 */
function useFormConfirmDirtyChange({
  promptMessage,
  onClose,
  confirmDirtyChanges = true,
}: UseFormConfirmDirtyChangeOptions) {
  /* -------------------------------------------------------------------------- */
  /*                                    Hooks                                   */
  /* -------------------------------------------------------------------------- */

  const { t } = useTranslation();
  const formDirtyRef = useRef<boolean | null>(null);

  const setFormDirtyChange = useCallback((isDirty: boolean) => {
    formDirtyRef.current = isDirty;
  }, []);

  const handleCloseEvent = (reason?: CloseReason) => {
    if (confirmDirtyChanges && formDirtyRef.current && reason !== 'action') {
      if (window.confirm(promptMessage ?? t('promptunsavedchanges'))) {
        onClose?.(reason);
      }
      return;
    }
    onClose?.(reason);
  };

  return { handleCloseEvent, setFormDirtyChange };
}

export default useFormConfirmDirtyChange;
