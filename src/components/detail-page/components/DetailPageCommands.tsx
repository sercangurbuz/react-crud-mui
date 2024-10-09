import { ReactNode } from 'react';

import { Close, Save, Undo } from '@mui/icons-material';
import LoadingButton, { LoadingButtonProps } from '@mui/lab/LoadingButton';

import { FlexBox } from '../../flexbox';
import useTranslation from '../../i18n/hooks/useTranslation';
import Add from '../../icons/Add';
import Delete from '../../icons/Delete';
import MoreButton, { MoreButtonItem } from '../../more-button/MoreButton';
import { CloseReason, CommandsPosition } from '../../page/Page';
import useSettings from '../../settings-provider/hooks/useSettings';
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

export type DetailPageCommmandsSettings = {
  content: ReactNode;
  layout: DetailPageCommandsLayoutContents;
  props: DetailPageCommandsState & DetailPageCommandsOptions;
};

export interface DetailPageCommandsProps extends DetailPageCommandsState {
  onCommands?: (props: DetailPageCommmandsSettings) => ReactNode;
  onExtraCommands?: () => ReactNode;
  commandsExtraProps?: DetailPageCommandsExtraProps;
}

// eslint-disable-next-line react-refresh/only-export-components
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

function DetailPageCommands(props: DetailPageCommandsProps) {
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
    /*   const menus = Object.values(saveCommandMenus).filter(
      ({ visible, key }) => visible && key !== mode,
    ); */
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
        title={`${createCommandLabel ?? t('newitemtitle')}\n(${SHORTCUT_NEWITEM.toUpperCase()})`}
        disabled={disabled.create}
        onClick={onCreate}
        /* menu={
          visible.copy
            ? [
                {
                  key: 'copy-item',
                  disabled: disabled.create,
                  onClick: onCopy as MenuItemType['onClick'],
                  icon: <CopyOutlined />,
                  label: t('copyitem'),
                },
              ]
            : undefined
        } */
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
      <LoadingButton
        key="discard"
        disabled={disabled.discardchanges}
        onClick={onDiscardChanges}
        startIcon={<Undo />}
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
      <LoadingButton
        key="delete"
        disabled={disabled.delete}
        color="error"
        loading={loading}
        startIcon={<Delete />}
        title={`${t('deletetitle')}\n(${SHORTCUT_DELETE.toUpperCase()})`}
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
      <LoadingButton
        key="close"
        variant="outlined"
        color="secondary"
        disabled={disabled.close}
        startIcon={<Close />}
        onClick={() => onClose?.('close-button')}
        children={t('close')}
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
      });
    }

    return layoutContent;
  };

  return <>{renderCommands()}</>;
}

export default DetailPageCommands;
