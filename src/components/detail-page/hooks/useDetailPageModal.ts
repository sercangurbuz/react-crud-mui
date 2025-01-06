import { useCallback, useEffect, useState } from 'react';
import { FieldValues } from 'react-hook-form';

import useArrayFieldHelpers from '../../form/hooks/useArrayFieldHelpers';
import { NeedDataReason } from '../pages/DetailPageContent';
import { DetailPageModalProps } from '../pages/DetailPageModal';

export type SelectedModelOptions<TModel extends FieldValues> = Pick<
  DetailPageModalProps<TModel>,
  'reason' | 'data' | 'disabled' | 'onAfterSave' | 'onAfterDelete'
>;

type HelperModelFields = {
  uid?: string;
  index?: number;
};

export type UseDetailPageModalReturn<TModel extends FieldValues> = Pick<
  DetailPageModalProps<TModel>,
  'reason' | 'open' | 'onReasonChange' | 'data' | 'disabled' | 'onAfterSave' | 'onAfterDelete'
> &
  HelperModelFields & {
    onOpen(model?: SelectedModelOptions<TModel>): void;
    onClose(): void;
  };

export interface UseDetailPageModalProps {
  models?: unknown[];
  uniqueIdParamName?: string;
  onVisibleChange?: (open: boolean) => void;
}

function useDetailPageModal<TModel extends FieldValues>({
  models,
  uniqueIdParamName,
  onVisibleChange,
}: UseDetailPageModalProps = {}) {
  /* -------------------------------------------------------------------------- */
  /*                                    Hooks                                   */
  /* -------------------------------------------------------------------------- */

  const [dpProps, setProps] = useState<DetailPageModalProps<TModel> & HelperModelFields>();
  const { getUID, findIndex } = useArrayFieldHelpers({
    models,
    uniqueIdParamName,
  });

  /**
   * We need reset current model id with new generated key as RHF useFieldArray regenerate new key for every update
   */
  useEffect(() => {
    if (models?.length && dpProps?.uid) {
      const newUID = getUID(models[dpProps.index!]);

      if (newUID && dpProps?.uid !== newUID) {
        setProps((p) => ({
          ...p,
          uid: newUID,
        }));
      }
    }
  }, [models, dpProps, getUID]);

  /* -------------------------------------------------------------------------- */
  /*                              DetailPage Events                             */
  /* -------------------------------------------------------------------------- */

  const onClose = useCallback(() => {
    setProps((p) => ({
      ...p,
      open: false,
      index: undefined,
      uid: undefined,
    }));

    onVisibleChange?.(false);
  }, [onVisibleChange]);

  const onOpen = useCallback(
    ({ data, disabled, reason, onAfterDelete, onAfterSave }: SelectedModelOptions<TModel> = {}) => {
      const pageReason = reason ?? (data ? 'fetch' : 'create');
      setProps({
        data,
        reason: pageReason,
        open: true,
        disabled,
        // this is needed for array field usage
        uid: pageReason === 'fetch' ? getUID(data) : undefined,
        index: pageReason === 'fetch' ? findIndex(data) : undefined,
        onAfterDelete,
        onAfterSave,
      });

      onVisibleChange?.(true);
    },
    [getUID, findIndex, onVisibleChange],
  );

  const setReason = useCallback((reason: NeedDataReason) => {
    setProps((p) => ({ ...p, reason }));

    if (reason === 'copy' || reason === 'create') {
      setProps((p) => ({ ...p, uid: undefined }));
    }
  }, []);

  return [
    onOpen,
    {
      ...dpProps,
      onReasonChange: setReason,
      onClose,
    },
  ] as const;
}

export default useDetailPageModal;
