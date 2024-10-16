import React, { ReactNode, useMemo } from 'react';
import { FieldValues } from 'react-hook-form';

import { ColumnDef, TableState } from '@tanstack/react-table';

import ValidationAlerts from '../../form/components/ValidationAlerts';
import { HeaderProps } from '../../header/Header';
import SearchIcon from '../../icons/SearchIcon';
import Alerts from '../../page/components/Alerts';
import { Message } from '../../page/hooks/useNormalizeMessages';
import Page, { PageProps } from '../../page/Page';
import Table, { TableProps } from '../../table/Table';
import { ServerError } from '../../utils';
import AutoSearch from '../components/AutoSearch';
import ListPageCommands, { ListPageCommandsProps } from '../components/ListPageCommands';
import ListPageHeader, { ListPageHeaderProps } from '../components/ListPageHeader';
import ListPageShortCuts from '../components/ListPageShortCuts';
import { ListPageContext, ListPageContextType } from '../hooks/useListPage';
import { DefaultTableStateSetters } from '../hooks/useListPageTableStates';
import { ListPageFilter, ListPageModel, PagingListModel } from './ListPageData';

/* -------------------------------------------------------------------------- */
/*                                    Types                                   */
/* -------------------------------------------------------------------------- */

export type ListPageWrapperLayoutProps = {
  content: ReactNode;
  pageContent: ReactNode;
  alertsContent: ReactNode;
  commandsContent: ReactNode;
};

export interface ListPageContentProps<TModel extends FieldValues, TFilter extends FieldValues>
  extends Omit<PageProps, 'commandsContent' | 'alertsContent' | 'autoSave' | 'onHeader'>,
    Pick<ListPageCommandsProps, 'onCommands' | 'onExtraCommands' | 'createCommandLabel'> {
  /**
   * Alerts
   */
  alerts?: Message[];
  /**
   * Event that fired with current index when active segment is changed
   */
  onSegmentChanged?: (index: number) => void;
  /**
   * Content component
   */
  filter?: () => ReactNode;
  /**
   * Page size
   */
  pageSize?: number;
  /**
   * Global pagesize functions
   */
  pageSizes?: number[] | ((count: number) => number[]);
  /**
   * Table states
   */
  tableStates?: Partial<TableState>;
  /**
   * Change event of table states
   */
  tableStateSetters: DefaultTableStateSetters;
  /**
   * Search event
   */
  onSearch: () => void;
  /**
   * Loading indicator
   */
  loading?: boolean;
  /**
   * External error indicator
   */
  error?: ServerError;
  /**
   * Exporting current models to excel
   */
  onExcelExport?: () => void;
  /**
   * ListPage columns
   * ==> MUST BE MEMOIZED <==
   */
  columns: ColumnDef<TModel>[];
  /**
   * Indicator that if onneeddata event is called or not on mount
   */
  searchOnLoad?: boolean;
  /**
   * Enable searching thru commands and shortcuts
   */
  enableSearch?: boolean;
  /**
   * Enable clearing filter values thru commands and shortcuts
   */
  enableClear?: boolean;
  /**
   * Enable creating new item thru commands and shortcuts
   */
  enableCreateItem?: boolean;
  /**
   * Enable exporting model to excel file
   */
  enableExport?: boolean;
  /**
   * Event called when clearing filters
   */
  onClear: () => void;
  /**
   * Automatically call onNeedData when any value of filter get changed
   */
  autoSearch?: boolean;
  /**
   * Table row key
   */
  rowKey?: string;
  /**
   * Disable all keyboard shortcuts,default all enabled
   */
  disableShortCuts?: boolean;
  /**
   * Hotkeys scope
   */
  hotkeyScopes?: string;
  /**
   * Current filter
   */
  currentFilter?: ListPageFilter<TFilter>;
  /**
   * Datasource
   */
  data?: ListPageModel<TModel>;
  /**
   * Custom list region component
   */
  list?: React.ComponentType<TableProps<TModel>>;
  /**
   * New item event fired when new item button pressed
   */
  onCreateItem?: () => void;
  /**
   * Custom header function
   */
  onHeader?: (props: ListPageHeaderProps) => ReactNode;
  /**
   * Active segment index (tab of step)
   */
  activeSegmentIndex?: number;
  onWrapperLayout?: (props: ListPageWrapperLayoutProps) => React.ReactNode;
}

function ListPageContent<TModel extends FieldValues, TFilter extends FieldValues>({
  activeSegmentIndex,
  alerts,
  autoSearch = true,
  columns,
  createCommandLabel,
  currentFilter,
  data,
  disabled,
  disableShortCuts,
  enableClear,
  enableCreateItem = true,
  enableExport,
  enableSearch,
  filter,
  hotkeyScopes,
  list: ListComponent,
  loading,
  onClear,
  onClose,
  onCommands,
  onCreateItem,
  onExcelExport,
  onExtraCommands,
  onHeader,
  onSearch,
  onTabChanged,
  tableStateSetters,
  onWrapperLayout,
  showHeader = true,
  tableStates,
  ...pageProps
}: ListPageContentProps<TModel, TFilter>) {
  /* -------------------------------------------------------------------------- */
  /*                                    Hooks                                   */
  /* -------------------------------------------------------------------------- */

  const defaultData = useMemo(() => [], []);

  /* -------------------------------------------------------------------------- */
  /*                               Render Helpers                               */
  /* -------------------------------------------------------------------------- */

  /**
   * Renders customization component of whole detailpage
   */
  const renderWrapperLayout = () => {
    const content = renderContentLayout();
    const alertsContent = renderAlerts();
    const commandsContent = renderCommands();
    const pageContent = renderPage(content, commandsContent, alertsContent);

    const props: ListPageWrapperLayoutProps = {
      content,
      pageContent,
      commandsContent,
      alertsContent,
    };

    if (onWrapperLayout) {
      return onWrapperLayout(props);
    }

    return pageContent;
  };

  /**
   * Renders BasePage and its content without Form component
   * @param content Component,children,tabs or steps nodes
   * @param commands Commands nodes
   */
  const renderPage = (content: ReactNode, commands: ReactNode, alertsContent: ReactNode) => {
    return (
      <Page
        icon={<SearchIcon />}
        {...pageProps}
        disabled={disabled}
        commandsContent={commands}
        onHeader={renderPageHeader}
        onClose={onClose}
        loading={loading}
        alertsContent={alertsContent}
        onTabChanged={onTabChanged}
        selectedTabIndex={activeSegmentIndex}
      >
        {content}
        {/* Shortcuts */}
        {renderShortCuts()}
      </Page>
    );
  };

  /**
   * Shortcuts
   */
  const renderShortCuts = () => {
    if (disableShortCuts) {
      return null;
    }

    return (
      <ListPageShortCuts
        onSearch={onSearch}
        onCreateItem={onCreateItem}
        onClear={onClear}
        scopes={hotkeyScopes}
      />
    );
  };

  /**
   * ListPage header node
   */
  const renderPageHeader = (props: HeaderProps) => {
    if (!showHeader) {
      return null;
    }

    const phProps: ListPageHeaderProps = {
      ...props,
      /* headerCommands: (
        <>
          {renderDevToolToggle()}
          {renderNavigationButtons()}
          {props.headerCommands}
        </>
      ), */
    };

    if (onHeader) {
      return onHeader(phProps);
    }

    return <ListPageHeader {...phProps} />;
  };

  /**
   * Render list buttons commands
   */
  const renderCommands = () => {
    const commandProps: ListPageCommandsProps = {
      onExcelExport,
      onSearch,
      onCreateItem,
      onClear,
      onCommands,
      onExtraCommands,
      createCommandLabel,
    };

    return <ListPageCommands {...commandProps} />;
  };

  /**
   * Merge server errors and client alerts
   */
  const renderAlerts = () => {
    return (
      <>
        <Alerts messages={alerts} />
        <ValidationAlerts />
      </>
    );
  };

  /**
   * Render all components
   */
  const renderContentLayout = () => {
    const filterContent = filter?.();
    const tableContent = renderTable();
    const autoSearchContent = renderAutoSearch();

    return (
      <>
        {filterContent}
        {tableContent}
        {autoSearchContent}
      </>
    );
  };

  /**
   * Render table either using List component or fallback to default Table component
   */
  const renderTable = () => {
    const props: Partial<TableProps<TModel>> = {
      columns,
      state: tableStates,
      manualPagination: true,
      rowCount: (data as PagingListModel<TModel>).dataCount,
      data: (data as PagingListModel<TModel>).data ?? defaultData,
      ...tableStateSetters,
    };

    const tableNode = ListComponent ? (
      <ListComponent {...(props as TableProps<TModel>)} />
    ) : (
      <Table {...(props as TableProps<TModel>)} />
    );

    return tableNode;
  };

  /**
   * Call search on every form changes
   */
  const renderAutoSearch = () => {
    if (!autoSearch) {
      return null;
    }

    return <AutoSearch onValuesChange={onSearch} />;
  };

  /* -------------------------------------------------------------------------- */
  /*                              ListPage Context                              */
  /* -------------------------------------------------------------------------- */

  const contextValue = useMemo<ListPageContextType<TModel, TFilter>>(
    () => ({
      onShowDetailPage: () => {},
      loading,
      data,
      search: onSearch,
      clear: onClear,
      currentFilter,
      enableClear,
      enableCreateItem,
      enableExport,
      enableSearch,
    }),
    [
      currentFilter,
      data,
      enableClear,
      enableCreateItem,
      enableExport,
      enableSearch,
      loading,
      onClear,
      onSearch,
    ],
  );

  /* --------------------------------- Render --------------------------------- */

  return (
    <ListPageContext.Provider value={contextValue}>
      {renderWrapperLayout()}
    </ListPageContext.Provider>
  );
}

export default ListPageContent;
