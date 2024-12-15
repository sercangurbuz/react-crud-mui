import React, { ReactNode, useMemo } from 'react';
import { FieldValues } from 'react-hook-form';

import ActionCommands, { ActionCommandsProps } from '../../action-commands/ActionCommands';
import useSettings from '../../crud-mui-provider/hooks/useSettings';
import useDetailPageModal from '../../detail-page/hooks/useDetailPageModal';
import { NeedDataReason } from '../../detail-page/pages/DetailPageContent';
import { DetailPageDrawerProps } from '../../detail-page/pages/DetailPageDrawer';
import { DetailPageModalProps } from '../../detail-page/pages/DetailPageModal';
import ValidationAlerts from '../../form/components/ValidationAlerts';
import { HeaderProps } from '../../header/Header';
import useTranslation from '../../i18n/hooks/useTranslation';
import SearchIcon from '../../icons/SearchIcon';
import Alerts from '../../page/components/Alerts';
import { Message } from '../../page/hooks/useNormalizeMessages';
import Page, { PageProps } from '../../page/Page';
import Table, { TableColumn, TableProps } from '../../table/Table';
import { ServerError } from '../../utils';
import AutoSearch from '../components/AutoSearch';
import ListPageCommands, { ListPageCommandsProps } from '../components/ListPageCommands';
import ListPageHeader, { ListPageHeaderProps } from '../components/ListPageHeader';
import ListPageShortCuts from '../components/ListPageShortCuts';
import { ListPageContext, ListPageContextType } from '../hooks/useListPage';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isDetailPageComponentObject = (value: any): value is DetailPageComponentOptions =>
  'create' in value || 'fetch' in value || 'copy' in value;

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

export type DetailPageComponentType<TDetailPageModel extends FieldValues = FieldValues> =
  React.ComponentType<
    DetailPageModalProps<TDetailPageModel> | DetailPageDrawerProps<TDetailPageModel>
  >;
export type DetailPageComponentOptions<TDetailPageModel extends FieldValues = FieldValues> =
  Partial<Record<NeedDataReason, DetailPageComponentType<TDetailPageModel>>>;

export type DetailPageComponent<TDetailPageModel extends FieldValues = FieldValues> =
  | DetailPageComponentOptions<TDetailPageModel>
  | DetailPageComponentType<TDetailPageModel>;

export interface ListPageContentProps<
  TModel extends FieldValues,
  TDetailPageModel extends FieldValues = FieldValues,
> extends Omit<
      PageProps,
      'commandsContent' | 'alertsContent' | 'autoSave' | 'onHeader' | 'onChange' | 'onCopy'
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
   * Enable table pagination default true
   */
  enablePagination?: boolean;
  /**
   * Custom list region component
   */
  list?: React.ComponentType<TableProps<TModel>>;
  /**
   * New item event fired when new item button pressed
   */
  onCreate?: () => void;
  /**
   * Edit event fired when edit action of the row clicked
   */
  onEdit?: (model: TModel) => void;
  /**
   * Copy event fired when copy action of the row clicked
   */
  onCopy?: (model: TModel) => void;
  /**
   * View event fired when view action of the row clicked
   */
  onView?: (model: TModel) => void;
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
  detailPage?: DetailPageComponent<TDetailPageModel>;
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
  dataCount,
  detailPage,
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
  onCopy,
  onCreate,
  onDelete,
  onEdit,
  onExcelExport,
  onExtraCommands,
  onHeader,
  onSearch,
  onTabChanged,
  onView,
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

  const [CreateDetailPage, EditDetailPage, CopyDetailPage] = useMemo(() => {
    if (!detailPage) {
      return [];
    }

    if (isDetailPageComponentObject(detailPage)) {
      return [detailPage['create'], detailPage['fetch'], detailPage['copy']] as Array<
        DetailPageComponentType<TDetailPageModel>
      >;
    }
    return [detailPage, detailPage, detailPage] as Array<DetailPageComponentType<TDetailPageModel>>;
  }, [detailPage]);

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
        onCreateItem={CreateDetailPage ? onOpen : onCreate}
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
      onCreateItem: CreateDetailPage ? onOpen : onCreate,
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

    if (error) {
      if (error.errors) {
        messages.push(
          ...error.errors.map((item) => `${item.message}.Error code : ${error.statusCode}`),
        );
      } else {
        if (error.message) {
          messages.push(`${error.message}.Error code : ${error.statusCode}`);
        }
      }
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
      columns: enableActionCommands
        ? [
            ...columns,
            {
              accessorKey: 'commands',
              align: 'center',
              header: () => null,
              enableSorting: false,
              cell(cell) {
                const data = cell.row.original;
                return (
                  <ActionCommands
                    onDelete={() => onDelete?.(cell.row.original)}
                    onView={() =>
                      EditDetailPage
                        ? onOpen({
                            data: data as unknown as TDetailPageModel,
                            disabled: true,
                          })
                        : onView?.(data)
                    }
                    onEdit={() =>
                      EditDetailPage
                        ? onOpen({ data: data as unknown as TDetailPageModel, disabled })
                        : onEdit?.(data)
                    }
                    onCopy={() =>
                      CopyDetailPage
                        ? onOpen({
                            data: data as unknown as TDetailPageModel,
                            disabled,
                            reason: 'copy',
                          })
                        : onCopy?.(data)
                    }
                    {...actionCommandsProps}
                  />
                );
              },
            },
          ]
        : columns,
      // this is for manual server pagination
      rowCount: dataCount || data?.length || 0,
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
    if (!dpProps?.open) {
      return null;
    }

    const reason = dpProps?.reason;
    const EmbededDetailPageComponent =
      reason === 'create' ? CreateDetailPage : reason === 'fetch' ? EditDetailPage : CopyDetailPage;

    if (!EmbededDetailPageComponent) {
      return null;
    }

    const isDisabled = dpProps.disabled;
    const props: DetailPageModalProps<TDetailPageModel> | DetailPageDrawerProps<TDetailPageModel> =
      {
        enableCreate: true,
        enableCopy: true,
        enableDiscardChanges: false,
        header: isDisabled
          ? t('browse')
          : reason === 'fetch'
            ? t('edit')
            : (createCommandLabel ?? t('newitem')),
        helperText: reason === 'copy' ? t('tags.copy') : null,
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
