import { useMemo } from 'react';
import { useFormState } from 'react-hook-form';

import useDetailPage from './useDetailPage';

export interface DetailPageCommandsFlag {
  copy?: boolean;
  save?: boolean;
  savecreate?: boolean;
  saveclose?: boolean;
  discardchanges?: boolean;
  delete?: boolean;
  close?: boolean;
  navigate?: boolean;
  create?: boolean;
}

export interface DetailPageCommandsOptions {
  visible: DetailPageCommandsFlag;
  disabled: DetailPageCommandsFlag;
  loading?: boolean;
  isNew: boolean;
  isDisabled?: boolean;
}

/**
 * Returns buttons props depending on validation,loading etc
 * Beware of rerender when state of form changes
 */
function useDetailPageStates() {
  /* -------------------------------------------------------------------------- */
  /*                                    Hooks                                   */
  /* -------------------------------------------------------------------------- */

  const {
    loading,
    enableCopy,
    enableCreate,
    enableDelete,
    enableClose,
    enableDiscardChanges,
    enableSave,
    reason,
    disabled,
  } = useDetailPage();
  const formStates = useFormState();
  // Flags
  const { isValid, isDirty } = formStates;

  const isNewMode = reason !== 'fetch' && reason !== 'view';
  const isDisabled = disabled;

  /* ------------------------------ Button states ----------------------------- */

  const props = useMemo<DetailPageCommandsOptions>(
    () => ({
      visible: {
        discardchanges: !isNewMode && !!enableDiscardChanges,
        save: !!enableSave,
        savecreate: !!enableSave && !!enableCreate,
        saveclose: !!enableSave && !!enableClose,
        delete: !isNewMode && !!enableDelete,
        create: !isNewMode && !!enableCreate,
        copy: !isNewMode && !!enableCopy,
        close: !!enableClose,
      },
      disabled: {
        create: !!loading,
        save: !isValid || (!isDirty && !isNewMode) || loading || isDisabled,
        delete: isNewMode || loading || isDisabled,
        discardchanges: !isDirty || loading || isDisabled,
        navigate: !!isNewMode || isDirty || loading || isDisabled,
      },
      loading,
      isNew: isNewMode,
      isDisabled,
    }),
    [
      isNewMode,
      enableDiscardChanges,
      enableSave,
      enableCreate,
      enableDelete,
      enableCopy,
      enableClose,
      loading,
      isValid,
      isDirty,
      isDisabled,
    ],
  );

  return props;
}

export default useDetailPageStates;
