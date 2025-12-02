import { useMemo, useState } from 'react';
import { FieldValues } from 'react-hook-form';
import toast from 'react-hot-toast';

import { UseFormReturn } from '../../form/hooks/useForm';
import { useRunAsync } from '../../hooks';
import useTranslation from '../../i18n/hooks/useTranslation';
import { isPromise } from '../../misc/isPromise';
import normalizeServerError from '../../misc/normalizeError';
import { Message } from '../../page/hooks/useNormalizeMessages';
import Page from '../../page/Page';
import { ServerError } from '../../utils';
import SuccessPanel, { SuccessPanelProps } from '../components/SuccessPanel';
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

export interface NavigatePayload<TModel extends FieldValues = FieldValues> extends BasePayload {
  direction: NavigationDirection;
  model: TModel;
}

export type NavigationDirection = 'next' | 'prev';

/* --------------------------- DetailPageDataProps -------------------------- */

export interface DetailPageDataProps<TModel extends FieldValues>
  extends Omit<
    DetailPageContentProps<TModel>,
    | 'onSave'
    | 'onDelete'
    | 'onDiscardChanges'
    | 'onCopy'
    | 'onSaveCreate'
    | 'onSaveClose'
    | 'onNavigate'
  > {
  /**
   * Save event
   * @returns if returns data,either in promise or object will bind to form data
   */
  onSave?: DataEvent<TModel, SavePayload<TModel>>;
  /**
   * Navigation buttons event when navigation is active
   * @returns if returns data,either in promise or object will bind to form data
   */
  onNavigate?: DataEvent<TModel, NavigatePayload<TModel>>;
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
   * Show success panel on create/save (Default false)
   */
  successPanelProps?: Omit<SuccessPanelProps<TModel>, 'onCreate' | 'onClose' | 'model'>;
  /**
   * Event called after succesfull save
   */
  onAfterSave?: (
    result: Awaited<DataResult<TModel>>,
    variables: SavePayload<TModel>,
    form: UseFormReturn<TModel>,
  ) => void;
  /**
   * Event called after succesfull delete
   */
  onAfterDelete?: (variables: DeletePayload<TModel>, form: UseFormReturn<TModel>) => void;
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
  onLayout,
  onReasonChange,
  onNavigate,
  onSave,
  reason = 'create',
  showSuccessMessages = true,
  successPanelProps,
  ...dpProps
}: DetailPageDataProps<TModel>) {
  /* -------------------------------------------------------------------------- */
  /*                                    Hooks                                   */
  /* -------------------------------------------------------------------------- */

  const { t } = useTranslation();
  const [runAsync, { loading: loadingState, error: errorState, reset: resetState }] = useRunAsync<
    TModel | void | undefined
  >();
  const [successPanelVisible, setSuccessPanelVisibility] = useState(false);

  /* -------------------------------------------------------------------------- */
  /*                                Form Methods                                */
  /* -------------------------------------------------------------------------- */

  const {
    reset,
    getFormModel,
    getValues,
    formState: { defaultValues: initialValues, isLoading: isDefaultValuesLoading },
  } = form;

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
      data,
      mode,
    };

    let result = onSave?.(variables, form);

    if (isPromise(result)) {
      result = await runAsync(result);
    }

    reset(result ?? model);

    if (showSuccessMessages && !autoSave) {
      toast.success(t('savedsuccesfully'));
    }

    if (reason === 'create' && successPanelProps && !autoSave) {
      setSuccessPanelVisibility(true);
    }

    onAfterSave?.(result as Awaited<DataResult<TModel>>, variables, form);
  };

  const handleSave = async () => {
    await save();
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
      data,
      model,
    };

    const result = onDelete?.(variables, form);

    if (isPromise(result)) {
      await runAsync(result);
    }

    if (showSuccessMessages) {
      toast.success(t('deletedsuccesfully'));
    }

    onAfterDelete?.(variables, form);
    onClose?.('action');
  };

  const handleDiscard = () => {
    reset();
    onDiscardChanges?.();
  };

  const handleCreate = (reason: NeedDataReason = 'create') => {
    onReasonChange?.(reason);
    resetState();
    setSuccessPanelVisibility(false);
  };

  const handleNavigate = (direction: NavigationDirection) => {
    const model = getValues();

    const variables: NavigatePayload<TModel> = { direction, reason, model };
    void onNavigate?.(variables, form);
  };

  /* -------------------------------------------------------------------------- */
  /*                                   Render                                   */
  /* -------------------------------------------------------------------------- */

  return (
    <DetailPageContent
      {...dpProps}
      form={form}
      alerts={messages}
      error={error}
      data={(data ?? initialValues) as TModel}
      autoSave={autoSave}
      loading={loading || loadingState || isDefaultValuesLoading}
      reason={reason}
      onCreate={() => handleCreate()}
      onCopy={() => handleCreate('copy')}
      onSaveCreate={() => void handleSaveAndCreate()}
      onSaveClose={() => void handleSaveClose()}
      onSave={() => void handleSave()}
      onDelete={() => void handleDelete()}
      onNavigate={(direction) => void handleNavigate(direction)}
      onDiscardChanges={handleDiscard}
      onClose={onClose}
      onLayout={(props) => {
        let pageLayoutProps = props;

        if (successPanelVisible) {
          const model = getValues();

          pageLayoutProps = {
            ...props,
            tabsContent: null,
            tabsHeaderContent: null,
            footerContent: null,
            content: (
              <SuccessPanel
                title={t('savedsuccesfully')}
                {...successPanelProps}
                model={model}
                onCreate={() => handleCreate()}
                onClose={() => onClose?.('close-button')}
              />
            ),
          };
        }

        return onLayout ? onLayout(pageLayoutProps) : <Page.Layout {...pageLayoutProps} />;
      }}
    />
  );
}

export default DetailPageData;
