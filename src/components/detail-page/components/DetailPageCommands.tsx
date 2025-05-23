import { ReactNode } from 'react';
import { FieldValues } from 'react-hook-form';

import Close from '@mui/icons-material/Close';
import Save from '@mui/icons-material/Save';
import Undo from '@mui/icons-material/Undo';
import LoadingButton, { LoadingButtonProps } from '@mui/lab/LoadingButton';
import Button from '@mui/material/Button';

import useSettings from '../../crud-mui-provider/hooks/useSettings';
import useTranslation from '../../i18n/hooks/useTranslation';
import Add from '../../icons/Add';
import Delete from '../../icons/Delete';
import MoreButton, { MoreButtonItem } from '../../more-button/MoreButton';
import { CloseReason, CommandsPosition } from '../../page/Page';
import useDetailPageStates from '../hooks/useDetailPageStates';
import { SaveMode } from '../pages/DetailPageData';

/* ---------------------------------- Types --------------------------------- */

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

export interface DetailPageCommandsExtraProps {
  save?: LoadingButtonProps;
  discardchanges?: LoadingButtonProps;
  delete?: LoadingButtonProps;
  close?: LoadingButtonProps;
  navigate?: LoadingButtonProps;
  create?: LoadingButtonProps;
}

export interface DetailPageCommandsOptions {
  visible: DetailPageCommandsFlag;
  disabled: DetailPageCommandsFlag;
  loading?: boolean;
  isNew: boolean;
  isDisabled?: boolean;
}

export type DetailPageCommandsState = {
  onSave?: () => void;
  onSaveCreate?: () => void;
  onCreate?: () => void;
  onCopy?: () => void;
  onDiscardChanges?: () => void;
  onDelete?: () => void;
  onClose?: (reason?: CloseReason) => void;
  onSaveClose?: () => void;
  saveCommandMode?: SaveMode;
  createCommandLabel?: ReactNode;
  commandsPosition?: CommandsPosition;
};

export type DetailPageCommandsLayoutContents = {
  save: ReactNode;
  create: ReactNode;
  discardChanges: ReactNode;
  delete: ReactNode;
  close: ReactNode;
  content: ReactNode;
  renderMoreCommand: (items: MoreButtonItem[]) => ReactNode;
  extra?: ReactNode;
};

export type DetailPageCommmandsSettings<TModel extends FieldValues = FieldValues> = {
  content: ReactNode;
  layout: DetailPageCommandsLayoutContents;
  props: DetailPageCommandsState & DetailPageCommandsOptions;
  data?: TModel;
};

export interface DetailPageCommandsProps<TModel extends FieldValues = FieldValues>
  extends DetailPageCommandsState {
  onCommands?: (props: DetailPageCommmandsSettings<TModel>) => ReactNode;
  onExtraCommands?: () => ReactNode;
  commandsExtraProps?: DetailPageCommandsExtraProps;
  data?: TModel;
}

export enum DetailPageCommandNames {
  SAVE = 'save',
  CREATE = 'create',
  COPY = 'copy',
  DISCARD = 'discard',
  DELETE = 'delete',
  CLOSE = 'close',
  NAVIGATE = 'navigate',
}

/* ----------------------- DetailPageButtons Component ---------------------- */

function DetailPageCommands<TModel extends FieldValues = FieldValues>(
  props: DetailPageCommandsProps<TModel>,
) {
  const {
    onCreate,
    onSave,
    onSaveClose,
    onSaveCreate,
    onCopy,
    onDiscardChanges,
    onDelete,
    onClose,
    saveCommandMode = 'save',
    onCommands,
    onExtraCommands,
    createCommandLabel,
    commandsExtraProps = {},
    commandsPosition = 'top-right',
    data,
  } = props;
  /* -------------------------------------------------------------------------- */
  /*                                   Hooks                                    */
  /* -------------------------------------------------------------------------- */
  const { t } = useTranslation();

  const {
    hotkeys: {
      save: SHORTCUT_SAVE,
      saveAndNewItem: SHORTCUT_SAVECREATE,
      saveClose: SHORTCUT_SAVECLOSE,
      delete: SHORTCUT_DELETE,
      newItem: SHORTCUT_NEWITEM,
    },
  } = useSettings();

  const { visible, disabled, loading, isNew } = useDetailPageStates();

  const saveCommandMenus: Record<SaveMode, LoadingButtonProps> = {
    save: {
      key: 'save',
      color: 'primary',
      variant: 'contained',
      startIcon: <Save />,
      disabled: disabled.save,
      onClick: onSave,
      title: `${t('savetitle')}\n(${SHORTCUT_SAVE.toUpperCase()})`,
      children: isNew ? t('save') : t('update'),
    },
    'save-close': {
      key: 'save-close',
      color: 'primary',
      startIcon: <Save />,
      title: `${t('saveclosetitle')}\n(${SHORTCUT_SAVECLOSE.toUpperCase()})`,
      children: isNew ? t('saveclose') : t('updateclose'),
      disabled: disabled.save,
      onClick: onSaveClose,
    },
    'save-create': {
      key: 'save-create',
      color: 'primary',
      startIcon: <Save />,
      disabled: disabled.save,
      onClick: onSaveCreate,
      title: `${
        isNew ? t('savecreate') : t('updatecreate')
      }\n(${SHORTCUT_SAVECREATE.toUpperCase()})`,
      children: isNew ? t('savecreate') : t('updatecreate'),
    },
  };
  /* -------------------------------------------------------------------------- */
  /*                               Render helpers                               */
  /* -------------------------------------------------------------------------- */

  const renderSave = (mode: SaveMode) => {
    if (!visible.save) {
      return null;
    }

    return (
      <LoadingButton
        {...(saveCommandMenus[mode] as unknown as LoadingButtonProps)}
        key={saveCommandMenus[mode].key}
        loading={loading}
        {...commandsExtraProps['save']}
      />
    );
  };

  const renderCreate = () => {
    if (!visible.create) {
      return null;
    }

    return (
      <LoadingButton
        key="create"
        color="success"
        startIcon={<Add />}
        // eslint-disable-next-line @typescript-eslint/no-base-to-string, @typescript-eslint/restrict-template-expressions
        title={`${createCommandLabel ?? t('newitemtitle')}\n(${SHORTCUT_NEWITEM.toUpperCase()})`}
        disabled={disabled.create}
        onClick={onCreate}
        // eslint-disable-next-line react/no-children-prop
        children={createCommandLabel ?? t('newitem')}
        {...commandsExtraProps['create']}
      />
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
        // eslint-disable-next-line react/no-children-prop
        children={t('discardchanges')}
        {...commandsExtraProps['discardchanges']}
      />
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
        // eslint-disable-next-line react/no-children-prop
        children={t('delete')}
        onClick={onDelete}
        {...commandsExtraProps['delete']}
      />
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
        // eslint-disable-next-line react/no-children-prop
        children={t('cancel')}
        {...commandsExtraProps['close']}
      />
    );
  };

  const renderMoreCommand = (options: MoreButtonItem[]) => {
    if (!options.length) {
      return null;
    }

    return <MoreButton options={options} key="more-options" />;
  };

  const renderCommands = () => {
    const saveContent = renderSave(saveCommandMode);
    const createContent = renderCreate();
    const discardChangesContent = renderDiscardChanges();
    const deleteContent = renderDelete();
    const closeContent = renderClose();
    const extra = onExtraCommands?.();
    const content = [
      saveContent,
      createContent,
      discardChangesContent,
      deleteContent,
      closeContent,
    ];

    const layoutContent = (
      <>
        {extra}
        {content}
      </>
    );

    const layoutParams: DetailPageCommandsLayoutContents = {
      save: saveContent,
      close: closeContent,
      content,
      create: createContent,
      delete: deleteContent,
      discardChanges: discardChangesContent,
      renderMoreCommand,
      extra,
    };

    const props: DetailPageCommandsState & DetailPageCommandsOptions = {
      onCreate,
      onSave,
      onSaveClose,
      onSaveCreate,
      onCopy,
      onDiscardChanges,
      onDelete,
      onClose,
      saveCommandMode,
      visible,
      disabled,
      loading,
      isNew,
      commandsPosition,
    };

    if (onCommands) {
      return onCommands({
        content: layoutContent,
        layout: layoutParams,
        props,
        data,
      });
    }

    return layoutContent;
  };

  return <>{renderCommands()}</>;
}

export default DetailPageCommands;
