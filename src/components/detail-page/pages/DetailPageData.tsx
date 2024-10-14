import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FieldValues } from 'react-hook-form';
import toast from 'react-hot-toast';

import { UseFormOptions, UseFormReturn } from '../../form/hooks/useForm';
import { useRunAsync, useUpdateEffect } from '../../hooks';
import useTranslation from '../../i18n/hooks/useTranslation';
import { isPromise } from '../../misc/isPromise';
import { Message } from '../../page/hooks/useNormalizeMessages';
import { DeepNullable, ServerError } from '../../utils';
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
  defaultValues?: Readonly<DeepNullable<TModel>>;
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

/**
 * Page component that all data manupulation is handled
 */
function DetailPageData<TModel extends FieldValues>({
  alerts,
  autoSave,
  data,
  defaultValues,
  error,
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
  showSuccessMessages = true,
  ...dpProps
}: DetailPageDataProps<TModel>) {
  /* -------------------------------------------------------------------------- */
  /*                                    Hooks                                   */
  /* -------------------------------------------------------------------------- */

  const prevDataRef = useRef<TModel | undefined>();
  const { t } = useTranslation();
  const [runAsync, { loading: loadingState, error: errorState, reset: resetState }] = useRunAsync<
    TModel | void | undefined
  >();

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

  /**
   * run onNeedData when reason and id changes.Be aware that onNeedData must be memoized
   */
  useEffect(() => {
    if (reason === 'create' && defaultValues) {
      updateForm(defaultValues as TModel);
    }
  }, [defaultValues, updateForm, reason]);

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
  /*                                   Alerts                                   */
  /* -------------------------------------------------------------------------- */

  const messages = useMemo<Message[]>(() => {
    const result: Message[] = [];

    if (alerts) {
      result.push(...alerts);
    }

    if (error?.message) {
      result.push(error.message);
    }

    if (errorState?.message) {
      result.push(errorState.message);
    }

    return result;
  }, [error, alerts, errorState]);

  /* -------------------------------------------------------------------------- */
  /*                                Model Methods                               */
  /* -------------------------------------------------------------------------- */

  const save = useCallback(
    async (mode: SaveMode = 'save') => {
      resetState();
      // get data thru submission
      const model = await getFormModel();

      const variables: SavePayload<TModel> = {
        reason,
        model,
        data: prevDataRef.current,
        mode,
      };

      let result = onSave?.(variables);

      if (isPromise(result)) {
        result = await runAsync(result);
      }

      if (result) {
        updateForm(result);
      }

      if (showSuccessMessages && !autoSave) {
        toast.success(t('savedsuccesfully'));
      }
    },
    [getFormModel, reason, showSuccessMessages, autoSave, onSave, t, updateForm],
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
    onClose?.('action');
  };

  const handleDelete = async () => {
    resetState();

    const model = getValues();

    const variables: DeletePayload<TModel> = {
      reason,
      data: prevDataRef.current,
      model,
    };

    const result = onDelete?.(variables);

    if (isPromise(result)) {
      await runAsync(result);
    }

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
    resetState();
  };

  /* -------------------------------------------------------------------------- */
  /*                                   Render                                   */
  /* -------------------------------------------------------------------------- */

  return (
    <DetailPageContent
      {...dpProps}
      alerts={messages}
      error={error}
      data={prevDataRef.current}
      autoSave={autoSave}
      loading={loading || loadingState}
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
