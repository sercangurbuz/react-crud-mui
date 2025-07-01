import { PropsWithChildren } from 'react';
import { useFormState } from 'react-hook-form';

import { Add, ArrowLeft, ArrowRight, Close, Delete, Save, Undo } from '@mui/icons-material';
import LoadingButton, { LoadingButtonProps } from '@mui/lab/LoadingButton';
import { Box, Button, ButtonProps } from '@mui/material';

import useSettings from '../../crud-mui-provider/hooks/useSettings';
import { FlexBox } from '../../flexbox';
import { UseFormReturn } from '../../form/hooks/useForm';
import useTranslation from '../../i18n/hooks/useTranslation';
import MoreButton from '../../more-button';
import { MoreButtonItem } from '../../more-button/MoreButton';
import { CloseReason } from '../../page/Page';
import { useDetailPageStates } from '../hooks';
import { DetailPageCommandsFlag } from '../hooks/useDetailPageStates';
import { SaveMode } from '../pages/DetailPageData';
import { StepPane } from './DetailPageStepsHeader';

export type DetailPageStandartCommandsOptions = {
  saveCommandMode?: SaveMode;
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
    moreCommands?: Partial<Record<keyof DetailPageCommandsFlag, true>>;
    commandsProps?: Partial<Record<keyof DetailPageCommandsFlag, ButtonProps>>;
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
    moreCommands,
    commandsProps,
  } = props;

  const {
    currentForm,
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
    if (!visible.save || moreCommands?.save) {
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
        {...commandsProps?.save}
      />
    );
  };

  const renderCreate = () => {
    if (!visible.create || moreCommands?.create) {
      return null;
    }

    return (
      <LoadingButton
        key="create"
        color="primary"
        startIcon={<Add />}
        title={`${t('newitemtitle')}\n(${SHORTCUT_NEWITEM.toUpperCase()})`}
        disabled={disabled.create}
        onClick={onCreate}
        // eslint-disable-next-line react/no-children-prop
        children={t('newitem')}
        {...commandsProps?.create}
      />
    );
  };

  const renderDiscardChanges = () => {
    if (!visible.discardchanges || moreCommands?.discardchanges) {
      return null;
    }
    return (
      <Button
        key="discard"
        disabled={disabled.discardchanges}
        onClick={onDiscardChanges}
        startIcon={<Undo />}
        // eslint-disable-next-line react/no-children-prop
        children={t('discardchanges')}
        {...commandsProps?.discardchanges}
      />
    );
  };

  const renderDelete = () => {
    if (!visible.delete || moreCommands?.delete) {
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
        // eslint-disable-next-line react/no-children-prop
        children={t('delete')}
        {...commandsProps?.delete}
      />
    );
  };

  const renderClose = () => {
    if (!visible.close || moreCommands?.close) {
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
        // eslint-disable-next-line react/no-children-prop
        children={t('cancel')}
        {...commandsProps?.close}
      />
    );
  };

  /* ----------------------------- Steps commands ----------------------------- */

  const renderPrev = () => {
    if (!showPrevButton || moreCommands?.prev) {
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
        // eslint-disable-next-line react/no-children-prop
        children={prevButtonTitle}
        {...commandsProps?.prev}
      />
    );
  };

  const renderNext = () => {
    if (!showNextButton || moreCommands?.next) {
      return null;
    }
    return (
      <LoadingButton
        key="next"
        onClick={onNextClick}
        color="primary"
        loading={loading}
        disabled={!isCurrentStepValid || loading}
        endIcon={<ArrowRight />}
        title={`${t('nextstep')}\n(${SHORTCUT_NEXT_STEP.toUpperCase()})`}
        // eslint-disable-next-line react/no-children-prop
        children={nextButtonTitle}
        {...commandsProps?.next}
      />
    );
  };

  /* -------------------------------------------------------------------------- */
  /*                                   Render                                   */
  /* -------------------------------------------------------------------------- */

  const renderMoreCommands = () => {
    const items = Object.keys(moreCommands ?? {})
      .map((key) => {
        if (
          moreCommands?.[key as keyof DetailPageCommandsFlag] &&
          visible[key as keyof DetailPageCommandsFlag]
        ) {
          switch (key as keyof DetailPageCommandsFlag) {
            case 'save':
            case 'saveclose':
            case 'savecreate':
              return {
                ...(saveCommandMenus[saveCommandMode] as unknown as LoadingButtonProps),
                children: saveCommandMenus[saveCommandMode].children,
                key: saveCommandMenus[saveCommandMode].key,
                icon: <Save />,
                disabled: mode === 'steps' ? !isCurrentStepValid : disabled.save,
              };
            case 'create':
              return {
                key: 'create',
                icon: <Add />,
                disabled: disabled.create,
                onClick: onCreate,
                children: t('newitem'),
              };
            case 'copy':
              break;
            case 'delete':
              return {
                key: 'delete',
                icon: <Delete />,
                disabled: disabled.delete,
                onClick: onDelete,
                danger: true,
                children: t('delete'),
              };
            case 'discardchanges':
              return {
                key: 'discardchanges',
                icon: <Undo />,
                disabled: disabled.discardchanges,
                onClick: onDiscardChanges,
                children: t('discardchanges'),
              };
            case 'close':
              return {
                key: 'close',
                icon: <Close />,
                disabled: disabled.close,
                onClick: onClose,
                children: t('cancel'),
              };
            case 'prev':
              return {
                key: 'prev',
                icon: <ArrowLeft />,
                disabled: disabled.close,
                onClick: onPrevClick,
                children: prevButtonTitle,
              };
            case 'next':
              return {
                key: 'next',
                onClick: onNextClick,
                disabled: !isCurrentStepValid || loading,
                icon: <ArrowRight />,
              };
          }
        }
      })
      .filter(Boolean) as MoreButtonItem[];

    if (!items.length) {
      return null;
    }

    return <MoreButton options={items} key="more-options" />;
  };

  const renderCommands = () => {
    const moreCommands = renderMoreCommands();

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
            {moreCommands}
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
      closeContent,
      discardChangesContent,
      createContent,
      deleteContent,
      saveContent,
    ];

    const layoutContent = (
      <>
        {extraCommandsContent}
        {content}
        {moreCommands}
      </>
    );

    return layoutContent;
  };

  return <>{renderCommands()}</>;
}

export default DetailPageCommands;
