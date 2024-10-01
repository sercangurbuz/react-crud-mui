import { useCallback, useEffect, useRef } from 'react';
import { DeepPartial, FieldValues } from 'react-hook-form';
import toast from 'react-hot-toast';

import { UseFormOptions, UseFormReturn } from '../../form/hooks/useForm';
import { useUpdateEffect } from '../../hooks';
import useTranslation from '../../i18n/hooks/useTranslation';
import DetailPageContent, { DetailPageContentProps, NeedDataReason } from './DetailPageContent';

/* -------------------------------------------------------------------------- */
/*                                    Types                                   */
/* -------------------------------------------------------------------------- */

export type DataResult<TModel> = TModel | Promise<TModel | void | undefined> | undefined | void;

export interface DataEvent<TModel, TVariables> {
  (variables: TVariables): DataResult<TModel>;
}

export type SaveMode = 'save' | 'save-close' | 'save-create';

export interface BasePayload {
  reason: NeedDataReason;
}

export interface SavePayload<TModel = FieldValues> extends BasePayload {
  model: TModel;
  data?: TModel;
  mode: SaveMode;
}

export interface DeletePayload<TModel = FieldValues> extends BasePayload {
  model: TModel;
  data?: TModel;
}
export interface NavigatePayload<TModel = FieldValues> extends BasePayload {
  direction: NavigationDirection;
  model: TModel;
}

export type NavigationDirection = 'next' | 'prev';

/* --------------------------- DetailPageDataProps -------------------------- */

export interface DetailPageDataProps<TModel extends FieldValues>
  extends Omit<
      DetailPageContentProps<TModel>,
      'onSave' | 'onDelete' | 'onDiscardChanges' | 'onCopy' | 'onSaveCreate' | 'onSaveClose'
    >,
    Pick<UseFormOptions<TModel>, 'schema'> {
  form: UseFormReturn<TModel>;
  defaultValues?: Readonly<DeepPartial<TModel>>;
  /**
   * Navigation buttons event when navigation is active
   * @returns if returns data,either in promise or object will bind to form data
   */
  onNavigate?: DataEvent<TModel, NavigatePayload<TModel>>;
  /**
   * Save event
   * @returns if returns data,either in promise or object will bind to form data
   */
  onSave?: DataEvent<TModel, SavePayload<TModel>>;
  /**
   * Delete event
   * @returns if returns data,either in promise or object will bind to form data
   */
  onDelete?: DataEvent<TModel, DeletePayload<TModel>>;
  /**
   * Reset form to its initial state
   */
  onDiscardChanges?: () => void;
  /**
   * Called after reason changed
   */
  onReasonChange?: (reason: NeedDataReason) => void;
  /**
   * Enable to show success messages (Default true)
   */
  showSuccessMessages?: boolean;
}

function DetailPageData<TModel extends FieldValues>({
  activeSegmentIndex = 0,
  autoSave,
  data,
  defaultValues,
  form,
  loading,
  onClose,
  onDelete,
  onDiscardChanges,
  onNavigate,
  onReasonChange,
  onSave,
  reason = 'create',
  schema,
  error,
  showSuccessMessages = true,
  ...dpProps
}: DetailPageDataProps<TModel>) {
  /* -------------------------------------------------------------------------- */
  /*                                    Hooks                                   */
  /* -------------------------------------------------------------------------- */

  const prevDataRef = useRef<TModel | undefined>();
  const { t } = useTranslation();

  /* -------------------------------------------------------------------------- */
  /*                                Form Methods                                */
  /* -------------------------------------------------------------------------- */

  const { reset, trigger, getFormModel, getValues } = form;

  // reset and revalidate form (if "onchange" in validationoptions is set)
  const updateForm = useCallback(
    (data: TModel | undefined): void => {
      if (data) {
        // reset and trigger validation for every data changes
        reset(data);
      }

      // validation might not to be desired to run on every data change
      // since there might be expensive validation rules.
      trigger();

      prevDataRef.current = data;
    },
    [reset, trigger],
  );

  useEffect(() => {
    if (data) {
      updateForm(data);
    }
  }, [data, updateForm]);

  // re-trigger validations when schema is changed
  // be sure data already set
  useUpdateEffect(() => {
    if (schema && prevDataRef.current) {
      trigger();
    }
  }, [schema, trigger]);

  /* -------------------------------------------------------------------------- */
  /*                                Model Methods                               */
  /* -------------------------------------------------------------------------- */

  const save = useCallback(
    async (mode: SaveMode = 'save') => {
      // get data thru submission
      const model = await getFormModel();

      const variables: SavePayload<TModel> = {
        reason,
        model,
        data: prevDataRef.current,
        mode,
      };

      await onSave?.(variables);

      if (showSuccessMessages && !autoSave) {
        toast.success(t('savedsuccesfully'));
      }
    },
    [getFormModel, reason, showSuccessMessages, autoSave, onSave, t],
  );

  const handleSave = async () => {
    await save();

    /**
     * Change reason to fetch after item creation
     */
    if (reason !== 'fetch') {
      onReasonChange?.('fetch');
    }
  };

  const handleSaveAndCreate = async () => {
    await save('save-create');
    handleCreate();
  };

  const handleSaveClose = async () => {
    await save('save-close');
    onClose?.();
  };

  const handleDelete = async () => {
    const model = getValues();

    const variables: DeletePayload<TModel> = {
      reason,
      data: prevDataRef.current,
      model,
    };

    await onDelete?.(variables);

    if (showSuccessMessages) {
      toast.success(t('deletedsuccesfully'));
    }
  };

  const handleDiscard = () => {
    reset();
    trigger();
    onDiscardChanges?.();
  };

  const handleCreate = (reason: NeedDataReason = 'create') => {
    onReasonChange?.(reason);
  };

  /* -------------------------------------------------------------------------- */
  /*                                   Render                                   */
  /* -------------------------------------------------------------------------- */

  return (
    <DetailPageContent
      {...dpProps}
      data={prevDataRef.current}
      error={error}
      activeSegmentIndex={activeSegmentIndex}
      autoSave={autoSave}
      loading={loading}
      reason={reason}
      onCreate={() => handleCreate()}
      onCopy={() => handleCreate('copy')}
      onSaveCreate={handleSaveAndCreate}
      onSaveClose={handleSaveClose}
      onSave={handleSave}
      onDelete={handleDelete}
      onDiscardChanges={handleDiscard}
      onClose={onClose}
    />
  );
}

export default DetailPageData;