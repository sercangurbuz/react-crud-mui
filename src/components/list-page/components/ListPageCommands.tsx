import { PropsWithChildren } from 'react';

import Print from '@mui/icons-material/Print';
import Search from '@mui/icons-material/Search';
import LoadingButton from '@mui/lab/LoadingButton';
import Button, { ButtonProps } from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';

import useSettings from '../../crud-mui-provider/hooks/useSettings';
import useTranslation from '../../i18n/hooks/useTranslation';
import Add from '../../icons/Add';
import Clear from '../../icons/Clear';
import MoreButton, { MoreButtonItem } from '../../more-button/MoreButton';
import useListPageCommandStates, { ListPageCommandsFlag } from '../hooks/useListPageCommandStates';

/* -------------------------------------------------------------------------- */
/*                                    Types                                   */
/* -------------------------------------------------------------------------- */

export type ListPageCommandsEvents = {
  onSearch: () => void;
  onCreateItem?: () => void;
  onClear?: () => void;
  onExcelExport?: () => void;
};

export type ListPageCommandsProps = ListPageCommandsEvents & {
  moreCommands?: Partial<Record<keyof ListPageCommandsFlag, true>>;
  commandsProps?: Partial<Record<keyof ListPageCommandsFlag, ButtonProps>>;
} & PropsWithChildren;

/* -------------------------------------------------------------------------- */
/*                          ListPageButton Component                          */
/* -------------------------------------------------------------------------- */

function ListPageCommands(props: ListPageCommandsProps) {
  const {
    onSearch,
    onCreateItem,
    onClear,
    onExcelExport,
    children: extraCommandsContent,
    moreCommands,
    commandsProps,
  } = props;

  /* -------------------------------------------------------------------------- */
  /*                                    Hooks                                   */
  /* -------------------------------------------------------------------------- */

  const { t } = useTranslation();
  const { visible, disabled, loading } = useListPageCommandStates();

  const {
    hotkeys: {
      search: SHORTCUT_SEARCH,
      newItem: SHORTCUT_NEWITEM,
      clear: SHORTCUT_CLEAR,
      export: SHORTCUT_EXPORT,
    },
  } = useSettings();

  /* -------------------------------------------------------------------------- */
  /*                               Render helpers                               */
  /* -------------------------------------------------------------------------- */

  const renderSearch = () => {
    if (!visible.search || moreCommands?.search) {
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
        // eslint-disable-next-line react/no-children-prop
        children={t('listpage.listbuttons.search')}
        {...commandsProps?.search}
      />
    );
  };

  const renderClear = () => {
    if (!visible.clear || moreCommands?.clear) {
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
        // eslint-disable-next-line react/no-children-prop
        children={t('listpage.listbuttons.clear')}
        {...commandsProps?.clear}
      />
    );
  };

  const renderExport = () => {
    if (!visible.export || moreCommands?.export) {
      return null;
    }
    return (
      <IconButton
        key="clear"
        color="secondary"
        variant="outlined"
        title={`${t('listpage.settings.exportExcel')}\n(${SHORTCUT_EXPORT.toUpperCase()})`}
        onClick={onExcelExport}
        disabled={disabled.export}
        // eslint-disable-next-line react/no-children-prop
        children={<Print />}
        {...commandsProps?.export}
      />
    );
  };

  const renderCreate = () => {
    if (!visible.create || moreCommands?.create) {
      return null;
    }
    return (
      <Button
        key="create"
        startIcon={<Add />}
        title={`${t('newitemtitle')}\n(${SHORTCUT_NEWITEM.toUpperCase()})`}
        onClick={() => onCreateItem?.()}
        disabled={disabled.create}
        // eslint-disable-next-line react/no-children-prop
        children={t('listpage.listbuttons.newitem')}
        {...commandsProps?.create}
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
          moreCommands?.[key as keyof ListPageCommandsFlag] &&
          visible[key as keyof ListPageCommandsFlag]
        ) {
          switch (key as keyof ListPageCommandsFlag) {
            case 'search':
              return {
                key: 'search',
                icon: <Search />,
                disabled: disabled.search,
                onClick: onSearch,
                children: t('listpage.listbuttons.search'),
              };
            case 'create':
              return {
                key: 'create',
                icon: <Add />,
                disabled: disabled.create,
                onClick: onCreateItem,
                children: t('listpage.listbuttons.newitem'),
              };
            case 'clear':
              return {
                key: 'clear',
                icon: <Clear />,
                disabled: disabled.clear,
                onClick: onClear,
                children: t('listpage.listbuttons.clear'),
              };
            case 'export':
              return {
                key: 'export',
                icon: <Print />,
                disabled: disabled.export,
                onClick: onExcelExport,
                children: t('listpage.settings.exportExcel'),
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
    const searchContent = renderSearch();
    const exportContent = renderExport();
    const clearContent = renderClear();
    const createContent = renderCreate();
    const content = [exportContent, clearContent, createContent, searchContent];

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

export default ListPageCommands;
