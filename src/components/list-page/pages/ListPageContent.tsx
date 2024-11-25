import React, { ComponentType, ReactNode, useMemo } from 'react';
import { FieldValues } from 'react-hook-form';

import { Visibility } from '@mui/icons-material';

import ActionCommands, { ActionCommandsProps } from '../../action-commands/ActionCommands';
import useDetailPageModal from '../../detail-page/hooks/useDetailPageModal';
import { DetailPageDrawerProps } from '../../detail-page/pages/DetailPageDrawer';
import { DetailPageModalProps } from '../../detail-page/pages/DetailPageModal';
import ValidationAlerts from '../../form/components/ValidationAlerts';
import { HeaderProps } from '../../header/Header';
import useTranslation from '../../i18n/hooks/useTranslation';
import Edit from '../../icons/Edit';
import SearchIcon from '../../icons/SearchIcon';
import Alerts from '../../page/components/Alerts';
import { Message } from '../../page/hooks/useNormalizeMessages';
import Page, { PageProps } from '../../page/Page';
import useSettings from '../../settings-provider/hooks/useSettings';
import Table, { TableColumn, TableProps } from '../../table/Table';
import { ServerError } from '../../utils';
import AutoSearch from '../components/AutoSearch';
import ListPageCommands, { ListPageCommandsProps } from '../components/ListPageCommands';
import ListPageHeader, { ListPageHeaderProps } from '../components/ListPageHeader';
import ListPageShortCuts from '../components/ListPageShortCuts';
import { ListPageContext, ListPageContextType } from '../hooks/useListPage';

/* -------------------------------------------------------------------------- */
/*                                    Types                                   */
/* -------------------------------------------------------------------------- */

export type ListPageWrapperLayoutProps = {
  content: ReactNode;
  pageContent: ReactNode;
  alertsContent: ReactNode;
  commandsContent: ReactNode;
  detailPageContent: ReactNode;
};

export interface ListPageContentProps<
  TModel extends FieldValues,
  TDetailPageModel extends FieldValues = FieldValues,
> extends Omit<
      PageProps,
      'commandsContent' | 'alertsContent' | 'autoSave' | 'onHeader' | 'onChange'
    >,
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
  filterContent?: ReactNode;
  /**
   * Table states
   */
  tableProps?: TableProps<TModel>;
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
   */
  columns: TableColumn<TModel>[];
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
  onClear?: () => void;
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
   * Datasource
   */
  data?: TModel[];
  /**
   * Total data row count of paging
   */
  dataCount?: number;
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
  /**
   * Embedded detail page component
   */
  detailPage?: ComponentType<
    DetailPageModalProps<TDetailPageModel> | DetailPageDrawerProps<TDetailPageModel>
  >;
  /**
   * Render action commands used with detailPage on every row
   */
  enableActionCommands?: boolean;
  /**
   * Actionm commands extra props
   */
  actionCommandsProps?: ActionCommandsProps;
  /**
   * Delete event when detailPage props is set
   */
  onDelete?: (model: TModel) => void;
}

function ListPageContent<
  TModel extends FieldValues,
  TDetailPageModel extends FieldValues = FieldValues,
>({
  activeSegmentIndex,
  actionCommandsProps,
  alerts,
  autoSearch = true,
  columns,
  createCommandLabel,
  data,
  dataCount = 0,
  detailPage: EmbededDetailPageComponent,
  disabled,
  disableShortCuts,
  enableActionCommands = true,
  enableClear,
  enableCreateItem = true,
  enableExport,
  enableSearch,
  error,
  filterContent,
  hotkeyScopes,
  list: ListComponent,
  loading,
  onClear,
  onClose,
  onCommands,
  onCreateItem,
  onDelete,
  onExcelExport,
  onExtraCommands,
  onHeader,
  onSearch,
  onTabChanged,
  tableProps,
  onWrapperLayout,
  showHeader = true,
  ...pageProps
}: ListPageContentProps<TModel, TDetailPageModel>) {
  /* -------------------------------------------------------------------------- */
  /*                                    Hooks                                   */
  /* -------------------------------------------------------------------------- */

  /* --------------------------- Embeded DetailPage --------------------------- */

  const { t } = useTranslation();
  const { uniqueIdParamName } = useSettings();
  const [onOpen, dpProps] = useDetailPageModal<TDetailPageModel>({
    models: data,
    uniqueIdParamName,
  });

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
    const detailPageContent = renderDetailPage();

    const props: ListPageWrapperLayoutProps = {
      content,
      pageContent,
      commandsContent,
      alertsContent,
      detailPageContent,
    };

    if (onWrapperLayout) {
      return onWrapperLayout(props);
    }

    return (
      <>
        {pageContent}
        {detailPageContent}
      </>
    );
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
        onExport={onExcelExport}
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
      onCreateItem: enableActionCommands && EmbededDetailPageComponent ? onOpen : onCreateItem,
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
    const messages = alerts ?? [];

    if (error?.message) {
      messages.unshift(error?.message);
    }
    return (
      <>
        <Alerts messages={messages} />
        <ValidationAlerts />
      </>
    );
  };

  /**
   * Render all components
   */
  const renderContentLayout = () => {
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
      ...tableProps,
      columns:
        enableActionCommands && EmbededDetailPageComponent
          ? [
              ...columns,
              {
                accessorKey: 'commands',
                align: 'center',
                header: () => null,
                enableSorting: false,
                cell(cell) {
                  const data = cell.row.original as unknown as TDetailPageModel;
                  return (
                    <ActionCommands
                      onDelete={() => onDelete?.(cell.row.original)}
                      onView={() =>
                        onOpen({
                          data,
                          disabled: true,
                        })
                      }
                      onEdit={() => onOpen({ data, disabled })}
                      onCopy={() =>
                        onOpen({
                          data,
                          disabled,
                          reason: 'copy',
                        })
                      }
                      {...actionCommandsProps}
                    />
                  );
                },
              },
            ]
          : columns,
      rowCount: dataCount,
      data,
      loading,
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

  /**
   * Render DetailPage opened from new item button
   */
  const renderDetailPage = () => {
    if (!EmbededDetailPageComponent || !dpProps?.open) {
      return null;
    }

    const isDisabled = dpProps.disabled;
    const props: DetailPageModalProps<TDetailPageModel> | DetailPageDrawerProps<TDetailPageModel> =
      {
        enableCreate: true,
        enableCopy: true,
        enableDiscardChanges: false,
        icon: isDisabled ? <Visibility /> : <Edit />,
        header: isDisabled
          ? t('browse')
          : dpProps?.reason === 'fetch'
            ? t('edit')
            : (createCommandLabel ?? t('newitem')),
        helperText: dpProps?.reason === 'copy' ? t('tags.copy') : null,
        createCommandLabel,
        ...dpProps,
      };

    return <EmbededDetailPageComponent {...props} />;
  };

  /* -------------------------------------------------------------------------- */
  /*                              ListPage Context                              */
  /* -------------------------------------------------------------------------- */

  const contextValue = useMemo<ListPageContextType<TModel>>(
    () => ({
      onShowDetailPage: onOpen,
      loading,
      data,
      search: onSearch,
      clear: onClear!,
      enableClear,
      enableCreateItem,
      enableExport,
      enableSearch,
    }),
    [
      data,
      enableClear,
      enableCreateItem,
      enableExport,
      enableSearch,
      loading,
      onClear,
      onOpen,
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
