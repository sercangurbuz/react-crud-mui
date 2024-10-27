import { ReactNode } from 'react';

import { Search } from '@mui/icons-material';
import LoadingButton, { LoadingButtonProps } from '@mui/lab/LoadingButton';
import { Button, ButtonProps } from '@mui/material';

import useTranslation from '../../i18n/hooks/useTranslation';
import Add from '../../icons/Add';
import Clear from '../../icons/Clear';
import Delete from '../../icons/Delete';
import MoreButton, { MoreButtonItem } from '../../more-button/MoreButton';
import useSettings from '../../settings-provider/hooks/useSettings';
import useListPageCommandStates from '../hooks/useListPageCommandStates';

/* -------------------------------------------------------------------------- */
/*                                    Types                                   */
/* -------------------------------------------------------------------------- */

export interface ListPageCommandsFlag {
  search?: boolean;
  export?: boolean;
  clear?: boolean;
  create?: boolean;
}

export interface ListPageCommandsExtraProps {
  search?: LoadingButtonProps;
  clear?: ButtonProps;
  create?: ButtonProps;
}

export interface ListPageCommandsOptions {
  visible: ListPageCommandsFlag;
  disabled: ListPageCommandsFlag;
  loading?: boolean;
}

export type ListPageCommandsStates = {
  onSearch: () => void;
  onCreateItem?: () => void;
  onClear?: () => void;
  onExcelExport?: () => void;
  createCommandLabel?: ReactNode;
};

export type ListPageCommandsLayoutContents = {
  search: ReactNode;
  clear: ReactNode;
  create: ReactNode;
  content: ReactNode;
  renderMoreCommand: (items: MoreButtonItem[]) => ReactNode;
  extra?: ReactNode;
};

export type ListPageCommmandsSettings = {
  content: ReactNode;
  layout: ListPageCommandsLayoutContents;
  props: ListPageCommandsStates & ListPageCommandsOptions;
};

export interface ListPageCommandsProps extends ListPageCommandsStates {
  onCommands?: (props: ListPageCommmandsSettings) => ReactNode;
  onExtraCommands?: () => ReactNode;
  commandsExtraProps?: ListPageCommandsExtraProps;
}

// eslint-disable-next-line react-refresh/only-export-components
export enum ListPageCommandNames {
  SEARCH = 'search',
  CLEAR = 'clear',
  CREATE = 'create',
  EXPORT = 'export',
  SELECT = 'select',
}

/* -------------------------------------------------------------------------- */
/*                          ListPageButton Component                          */
/* -------------------------------------------------------------------------- */

function ListPageCommands(props: ListPageCommandsProps) {
  const {
    onSearch,
    onCreateItem,
    onClear,
    onExcelExport,
    onCommands,
    onExtraCommands,
    createCommandLabel,
    commandsExtraProps = {},
  } = props;

  /* -------------------------------------------------------------------------- */
  /*                                    Hooks                                   */
  /* -------------------------------------------------------------------------- */

  const { t } = useTranslation();
  const { visible, disabled, loading } = useListPageCommandStates();
  const {
    hotkeys: { search: SHORTCUT_SEARCH, newItem: SHORTCUT_NEWITEM, clear: SHORTCUT_CLEAR },
  } = useSettings();

  /* -------------------------------------------------------------------------- */
  /*                               Render helpers                               */
  /* -------------------------------------------------------------------------- */

  const renderSearch = () => {
    if (!visible.search) {
      return null;
    }

    return (
      <LoadingButton
        key="search"
        startIcon={<Search />}
        title={`${t('listpage.listbuttons.searchtitle')}\n(${SHORTCUT_SEARCH.toUpperCase()})`}
        onClick={onSearch}
        color="success"
        disabled={disabled.search}
        loading={loading}
        children={t('listpage.listbuttons.search')}
        {...commandsExtraProps['search']}
      />
    );
  };

  const renderClear = () => {
    if (!visible.clear) {
      return null;
    }
    return (
      <Button
        key="clear"
        startIcon={<Clear />}
        color="secondary"
        variant="outlined"
        title={`${t('listpage.listbuttons.cleartitle')}\n(${SHORTCUT_CLEAR.toUpperCase()})`}
        onClick={onClear}
        disabled={disabled.clear}
        children={t('listpage.listbuttons.clear')}
        {...commandsExtraProps['clear']}
      />
    );
  };

  const renderCreate = () => {
    if (!visible.create) {
      return null;
    }
    return (
      <Button
        key="create"
        startIcon={<Add />}
        title={`${createCommandLabel ?? t('newitemtitle')}\n(${SHORTCUT_NEWITEM.toUpperCase()})`}
        onClick={() => onCreateItem?.()}
        disabled={disabled.create}
        children={createCommandLabel ?? t('listpage.listbuttons.newitem')}
        {...commandsExtraProps['create']}
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
    const searchContent = renderSearch();
    const clearContent = renderClear();
    const createContent = renderCreate();
    const content = [searchContent, clearContent, createContent];
    const extra = onExtraCommands?.();

    const layoutContent = (
      <>
        {extra}
        {content}
      </>
    );

    const layoutParams: ListPageCommandsLayoutContents = {
      search: searchContent,
      clear: clearContent,
      create: createContent,
      content,
      renderMoreCommand,
      extra,
    };

    const props: ListPageCommandsStates & ListPageCommandsOptions = {
      onSearch,
      onCreateItem,
      onClear,
      onExcelExport,
      visible,
      disabled,
      loading,
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

export default ListPageCommands;
