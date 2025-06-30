import { PropsWithChildren, ReactNode } from 'react';
import { useFormState } from 'react-hook-form';

import { Add, ArrowLeft, ArrowRight, Close, Delete, Save, Undo } from '@mui/icons-material';
import LoadingButton, { LoadingButtonProps } from '@mui/lab/LoadingButton';
import { Box, Button } from '@mui/material';

import useSettings from '../../crud-mui-provider/hooks/useSettings';
import { FlexBox } from '../../flexbox';
import { UseFormReturn } from '../../form/hooks/useForm';
import useTranslation from '../../i18n/hooks/useTranslation';
import { CloseReason } from '../../page/Page';
import { useDetailPageStates } from '../hooks';
import { SaveMode } from '../pages/DetailPageData';
import { StepPane } from './DetailPageStepsHeader';

export type DetailPageStandartCommandsOptions = {
  saveCommandMode?: SaveMode;
  createCommandLabel?: ReactNode;
  saveCommandLabel?: ReactNode;
};

export type DetailPageStepCommandsOptions = {
  nextButtonTitle?: React.ReactNode;
  prevButtonTitle?: React.ReactNode;
  showNextButton?: boolean;
  showPrevButton?: boolean;
  currentKey: React.Key;
  name: string;
  activeStepIndex: number;
  steps: StepPane[];
  currentForm?: UseFormReturn;
};

export type DetailPageCommandsOptions = DetailPageStandartCommandsOptions &
  DetailPageStepCommandsOptions;

export type DetailPageStandartCommandsEvents = {
  onSave?: () => void;
  onSaveCreate?: () => void;
  onCreate?: () => void;
  onCopy?: () => void;
  onDiscardChanges?: () => void;
  onDelete?: () => void;
  onClose?: (reason?: CloseReason) => void;
  onSaveClose?: () => void;
};

export type DetailPageStepCommandsEvents = {
  onNextClick?: () => void;
  onPrevClick?: () => void;
};

export type DetailPageCommandsProps = DetailPageStandartCommandsEvents &
  DetailPageStepCommandsEvents & {
    options: DetailPageCommandsOptions;
    mode: 'standard' | 'steps';
  } & PropsWithChildren;

function DetailPageCommands(props: DetailPageCommandsProps) {
  const {
    mode,
    onSave,
    onSaveClose,
    onDelete,
    onSaveCreate,
    onClose,
    onDiscardChanges,
    onCreate,
    onPrevClick,
    onNextClick,
    options,
    children: extraCommandsContent,
  } = props;

  const {
    currentForm,
    createCommandLabel,
    saveCommandLabel,
    showPrevButton,
    showNextButton,
    prevButtonTitle,
    nextButtonTitle,
    steps,
    activeStepIndex,
    saveCommandMode = 'save',
  } = options;
  /* -------------------------------------------------------------------------- */
  /*                                    Hooks                                   */
  /* -------------------------------------------------------------------------- */

  const { t } = useTranslation();

  const {
    hotkeys: {
      save: SHORTCUT_SAVE,
      saveAndNewItem: SHORTCUT_SAVECREATE,
      saveClose: SHORTCUT_SAVECLOSE,
      delete: SHORTCUT_DELETE,
      newItem: SHORTCUT_NEWITEM,
      nextStep: SHORTCUT_NEXT_STEP,
      prevStep: SHORTCUT_PREV_STEP,
    },
  } = useSettings();

  const { visible, disabled, loading, isNew } = useDetailPageStates();

  const { isValid: isCurrentStepValid } = useFormState({
    control: currentForm?.control,
    disabled: mode === 'steps' && !currentForm,
  });

  /* -------------------------------------------------------------------------- */
  /*                               Render helpers                               */
  /* -------------------------------------------------------------------------- */

  const saveCommandMenus: Record<SaveMode, LoadingButtonProps> = {
    save: {
      key: 'save',
      onClick: onSave,
      title: `${t('savetitle')}\n(${SHORTCUT_SAVE.toUpperCase()})`,
      children: isNew ? t('save') : t('update'),
    },
    'save-close': {
      key: 'save-close',
      title: `${t('saveclosetitle')}\n(${SHORTCUT_SAVECLOSE.toUpperCase()})`,
      children: isNew ? t('saveclose') : t('updateclose'),
      onClick: onSaveClose,
    },
    'save-create': {
      key: 'save-create',
      onClick: onSaveCreate,
      title: `${
        isNew ? t('savecreate') : t('updatecreate')
      }\n(${SHORTCUT_SAVECREATE.toUpperCase()})`,
      children: isNew ? t('savecreate') : t('updatecreate'),
    },
  };

  /* ---------------------------- Standart Commands --------------------------- */

  const renderSave = (saveMode: SaveMode) => {
    if (!visible.save) {
      return null;
    }

    return (
      <LoadingButton
        {...(saveCommandMenus[saveMode] as unknown as LoadingButtonProps)}
        key={saveCommandMenus[saveMode].key}
        color="success"
        startIcon={<Save />}
        disabled={mode === 'steps' ? !isCurrentStepValid : disabled.save}
        loading={loading}
      >
        {saveCommandLabel ?? saveCommandMenus[saveMode].children}
      </LoadingButton>
    );
  };

  const renderCreate = () => {
    if (!visible.create) {
      return null;
    }

    return (
      <LoadingButton
        key="create"
        color="primary"
        startIcon={<Add />}
        // eslint-disable-next-line @typescript-eslint/no-base-to-string, @typescript-eslint/restrict-template-expressions
        title={`${createCommandLabel ?? t('newitemtitle')}\n(${SHORTCUT_NEWITEM.toUpperCase()})`}
        disabled={disabled.create}
        onClick={onCreate}
      >
        {createCommandLabel ?? t('newitem')}
      </LoadingButton>
    );
  };

  const renderDiscardChanges = () => {
    if (!visible.discardchanges) {
      return null;
    }
    return (
      <Button
        key="discard"
        disabled={disabled.discardchanges}
        onClick={onDiscardChanges}
        startIcon={<Undo />}
      >
        {t('discardchanges')}
      </Button>
    );
  };

  const renderDelete = () => {
    if (!visible.delete) {
      return null;
    }

    return (
      <Button
        key="delete"
        disabled={disabled.delete}
        color="error"
        startIcon={<Delete />}
        title={`${t('deletetitle')}\n(${SHORTCUT_DELETE.toUpperCase()})`}
        onClick={onDelete}
      >
        {t('delete')}
      </Button>
    );
  };

  const renderClose = () => {
    if (!visible.close) {
      return null;
    }

    return (
      <Button
        key="close"
        variant="outlined"
        color="secondary"
        disabled={disabled.close}
        startIcon={<Close />}
        onClick={() => onClose?.('close-button')}
      >
        {t('cancel')}
      </Button>
    );
  };

  /* ----------------------------- Steps commands ----------------------------- */

  const renderPrev = () => {
    if (!showPrevButton) {
      return null;
    }

    return (
      <Button
        key="prev"
        variant="outlined"
        onClick={onPrevClick}
        startIcon={<ArrowLeft />}
        color="secondary"
        title={`${t('prevstep')}\n(${SHORTCUT_PREV_STEP.toUpperCase()})`}
      >
        {prevButtonTitle}
      </Button>
    );
  };

  const renderNext = () => {
    if (!showNextButton) {
      return null;
    }
    return (
      <LoadingButton
        key="next"
        onClick={onNextClick}
        color="primary"
        loading={loading}
        disabled={!isCurrentStepValid}
        endIcon={<ArrowRight />}
        title={`${t('nextstep')}\n(${SHORTCUT_NEXT_STEP.toUpperCase()})`}
      >
        {nextButtonTitle}
      </LoadingButton>
    );
  };

  /* -------------------------------------------------------------------------- */
  /*                                   Render                                   */
  /* -------------------------------------------------------------------------- */

  const renderCommands = () => {
    if (mode === 'steps') {
      const prevContent = renderPrev();
      const nextContent = renderNext();
      const closeContent = renderClose();
      const finishContent = renderSave(saveCommandMode);

      return (
        <>
          <Box>
            {prevContent}
            {extraCommandsContent}
          </Box>
          <FlexBox gap={1}>
            {closeContent}
            {visible.save && steps.length === activeStepIndex + 1 ? finishContent : null}
            {nextContent}
          </FlexBox>
        </>
      );
    }

    const saveContent = renderSave(saveCommandMode);
    const createContent = renderCreate();
    const discardChangesContent = renderDiscardChanges();
    const deleteContent = renderDelete();
    const closeContent = renderClose();

    const content = [
      saveContent,
      createContent,
      discardChangesContent,
      deleteContent,
      closeContent,
    ];

    const layoutContent = (
      <>
        {extraCommandsContent}
        {content}
      </>
    );

    return layoutContent;
  };

  return <>{renderCommands()}</>;
}

export default DetailPageCommands;
