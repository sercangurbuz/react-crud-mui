import { useCallback, useEffect, useMemo, useRef } from 'react';
import { FieldValues } from 'react-hook-form';
import toast from 'react-hot-toast';

import { UseFormReturn } from '../../form/hooks/useForm';
import { useRunAsync } from '../../hooks';
import useTranslation from '../../i18n/hooks/useTranslation';
import { isPromise } from '../../misc/isPromise';
import normalizeServerError from '../../misc/normalizeError';
import { Message } from '../../page/hooks/useNormalizeMessages';
import { ServerError } from '../../utils';
import DetailPageContent, { DetailPageContentProps, NeedDataReason } from './DetailPageContent';

/* -------------------------------------------------------------------------- */
/*                                    Types                                   */
/* -------------------------------------------------------------------------- */

export type DataResult<TModel> = TModel | Promise<TModel | void | undefined> | undefined | void;

export interface DataEvent<TModel extends FieldValues, TVariables> {
  (variables: TVariables, form: UseFormReturn<TModel>): DataResult<TModel>;
}

export type SaveMode = 'save' | 'save-close' | 'save-create';

export interface BasePayload {
  reason: NeedDataReason;
}

export interface SavePayload<TModel extends FieldValues = FieldValues> extends BasePayload {
  model: TModel;
  data?: TModel;
  mode: SaveMode;
}

export interface DeletePayload<TModel extends FieldValues = FieldValues> extends BasePayload {
  model: TModel;
  data?: TModel;
}

/* --------------------------- DetailPageDataProps -------------------------- */

export interface DetailPageDataProps<TModel extends FieldValues>
  extends Omit<
    DetailPageContentProps<TModel>,
    'onSave' | 'onDelete' | 'onDiscardChanges' | 'onCopy' | 'onSaveCreate' | 'onSaveClose'
  > {
  form: UseFormReturn<TModel>;
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
  /**
   * Event called after succesfull save
   */
  onAfterSave?: (result: Awaited<DataResult<TModel>>, variables: SavePayload<TModel>) => void;
  /**
   * Event called after succesfull delete
   */
  onAfterDelete?: (variables: DeletePayload<TModel>) => void;
}

/**
 * Page component that all data manupulation is handled
 */
function DetailPageData<TModel extends FieldValues>({
  alerts,
  autoSave,
  data,
  error,
  form,
  loading,
  onAfterDelete,
  onAfterSave,
  onClose,
  onDelete,
  onDiscardChanges,
  onReasonChange,
  onSave,
  reason = 'create',
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

  const {
    reset,
    trigger,
    getFormModel,
    getValues,
    formState: { defaultValues, isLoading: isDefaultValuesLoading },
  } = form;

  // reset and trigger validation for every data changes
  const updateForm = useCallback(
    (data: TModel | undefined): void => {
      if (data) {
        reset(data, { keepDefaultValues: true });
      }

      void trigger();
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

  /* -------------------------------------------------------------------------- */
  /*                                   Alerts                                   */
  /* -------------------------------------------------------------------------- */

  const messages = useMemo<Message[]>(() => {
    const result: Message[] = [];

    const addErrors = (err: ServerError) => {
      result.push(...normalizeServerError(err));
    };

    if (alerts) {
      result.push(...alerts);
    }

    if (error) {
      addErrors(error);
    }

    if (errorState) {
      addErrors(errorState);
    }

    return result;
  }, [error, alerts, errorState]);

  /* -------------------------------------------------------------------------- */
  /*                                Model Methods                               */
  /* -------------------------------------------------------------------------- */

  const save = async (mode: SaveMode = 'save') => {
    resetState();
    // get data thru submission
    const model = await getFormModel();

    const variables: SavePayload<TModel> = {
      reason,
      model,
      data: prevDataRef.current,
      mode,
    };

    let result = onSave?.(variables, form);

    if (isPromise(result)) {
      result = await runAsync(result);
    }

    if (result) {
      updateForm(result);
    }

    if (showSuccessMessages && !autoSave) {
      toast.success(t('savedsuccesfully'));
    }

    onAfterSave?.(result as Awaited<DataResult<TModel>>, variables);
  };

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

    const result = onDelete?.(variables, form);

    if (isPromise(result)) {
      await runAsync(result);
    }

    if (showSuccessMessages) {
      toast.success(t('deletedsuccesfully'));
    }

    onAfterDelete?.(variables);
  };

  const handleDiscard = () => {
    reset();
    void trigger();
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
      loading={loading || loadingState || isDefaultValuesLoading}
      reason={reason}
      onCreate={() => handleCreate()}
      onCopy={() => handleCreate('copy')}
      onSaveCreate={() => void handleSaveAndCreate()}
      onSaveClose={() => void handleSaveClose()}
      onSave={() => void handleSave()}
      onDelete={() => void handleDelete()}
      onDiscardChanges={handleDiscard}
      onClose={onClose}
    />
  );
}

export default DetailPageData;
