import React, { ReactNode, useCallback, useMemo } from 'react';
import { FieldValues } from 'react-hook-form';

import ActionCommands, { ActionCommandsProps } from '../../action-commands/ActionCommands';
import useDetailPageModal from '../../detail-page/hooks/useDetailPageModal';
import { NeedDataReason } from '../../detail-page/pages/DetailPageContent';
import { DetailPageDrawerProps } from '../../detail-page/pages/DetailPageDrawer';
import { DetailPageModalProps } from '../../detail-page/pages/DetailPageModal';
import ValidationAlerts from '../../form/components/ValidationAlerts';
import { HeaderProps } from '../../header/Header';
import useTranslation from '../../i18n/hooks/useTranslation';
import SearchIcon from '../../icons/SearchIcon';
import normalizeServerError from '../../misc/normalizeError';
import Alerts from '../../page/components/Alerts';
import { Message } from '../../page/hooks/useNormalizeMessages';
import Page, { PageProps } from '../../page/Page';
import { DEFAULT_ROW_KEY_FIELD } from '../../table/constants';
import Table, { TableColumn, TableProps } from '../../table/Table';
import { ServerError } from '../../utils';
import AutoSearch from '../components/AutoSearch';
import CardList, { CardListProps } from '../components/CardList';
import ListPageCommands, { ListPageCommandsProps } from '../components/ListPageCommands';
import ListPageHeader, { ListPageHeaderProps } from '../components/ListPageHeader';
import ListPageShortCuts from '../components/ListPageShortCuts';
import { ListPageContext, ListPageContextType } from '../hooks/useListPage';

/* -------------------------------------------------------------------------- */
/*                                    Types                                   */
/* -------------------------------------------------------------------------- */

export type ListType = 'table' | 'card';

export type ListPageWrapperLayoutProps = {
  content: ReactNode;
  pageContent: ReactNode;
  alertsContent: ReactNode;
  commandsContent: ReactNode;
  detailPageContent: ReactNode;
};

type DetailPageRender<TDetailPageModel extends FieldValues> = (
  props: DetailPageModalProps<TDetailPageModel> | DetailPageDrawerProps<TDetailPageModel>,
  open: ReturnType<typeof useDetailPageModal<TDetailPageModel>>[0],
) => ReactNode;

export type OnDetailPage<TDetailPageModel extends FieldValues> =
  | Partial<Record<NeedDataReason, DetailPageRender<TDetailPageModel>>>
  | DetailPageRender<TDetailPageModel>;

export interface ListPageContentProps<TModel extends FieldValues>
  extends Omit<
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
  columns?: TableColumn<TModel>[];
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
  onCustomTable?: (props: TableProps<TModel>) => ReactNode;
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
   * Embedded detail page component render function
   */
  onDetailPage?: OnDetailPage<TModel>;
  /**
   * Render action commands used with detailPage on every row
   */
  enableActionCommands?: boolean;
  /**
   * Actionm commands extra props
   */
  actionCommandsProps?: Partial<ActionCommandsProps<TModel>>;
  /**
   * Custom render function for action commands
   */
  onActionCommands?: (props: ActionCommandsProps<TModel>) => ReactNode;
  /**
   * Action click event.Its not get fired in case OnDetailPage provided for create,edit copy reasons
   */
  onActionClick?: (reason: NeedDataReason | 'delete', model?: TModel) => void;
  /**
   * Open detailPage in view mode as default or in which reason provided
   */
  enableRowClickToDetails?: boolean | NeedDataReason;
  /**
   * Call search after save & delete actions of detailpage,default true
   */
  enableRefetch?: boolean;
  /**
   * Card Col props
   */
  cardProps?: CardListProps<TModel>;
  /**
   * List type @default table
   */
  listType?: ListType;
}

function ListPageContent<TModel extends FieldValues>({
  activeSegmentIndex,
  actionCommandsProps,
  alerts,
  autoSearch = true,
  cardProps,
  children,
  columns,
  createCommandLabel,
  data,
  dataCount,
  disabled,
  disableShortCuts,
  enableActionCommands,
  enableRowClickToDetails,
  enableClear,
  enableCreateItem = true,
  enableRefetch,
  enableExport,
  enableSearch,
  error,
  filterContent,
  hotkeyScopes,
  listType = 'table',
  loading,
  onActionClick,
  onActionCommands,
  onClear,
  onClose,
  onCommands,
  onCustomTable,
  onDetailPage,
  onExcelExport,
  onExtraCommands,
  onHeader,
  onSearch,
  onTabChanged,
  tableProps,
  onWrapperLayout,
  showHeader = true,
  ...pageProps
}: ListPageContentProps<TModel>) {
  /* -------------------------------------------------------------------------- */
  /*                                    Hooks                                   */
  /* -------------------------------------------------------------------------- */

  const { t } = useTranslation();

  /* ---------------------------- Action DetailPage --------------------------- */

  const [openDetailPage, detailPageProps] = useDetailPageModal<TModel>({
    models: data,
    uniqueIdParamName: tableProps?.rowIdField ?? DEFAULT_ROW_KEY_FIELD,
  });

  const triggerAction = useCallback(
    (reason: NeedDataReason, data?: TModel) => {
      const useDetailPage = typeof onDetailPage === 'function' ? true : !!onDetailPage?.[reason];

      if (useDetailPage) {
        return openDetailPage({
          data,
          reason,
          disabled,
        });
      }
      //call fallback action handler
      onActionClick?.(reason, data);
    },
    [disabled, onActionClick, onDetailPage, openDetailPage],
  );

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
        onCreateItem={() => triggerAction('create')}
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
      onCreateItem: () => triggerAction('create'),
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
      messages.push(...normalizeServerError(error));
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
    const tableContent = listType === 'card' ? renderCard() : renderTable();
    const autoSearchContent = renderAutoSearch();

    return (
      <>
        {children}
        {filterContent}
        {tableContent}
        {autoSearchContent}
      </>
    );
  };

  /**
   * Render card component
   */
  const renderCard = () => {
    if (!cardProps) {
      return null;
    }

    return (
      <CardList<TModel>
        {...cardProps}
        onActionCommandProps={(data, index) => ({
          onDelete: () => onActionClick?.('delete', data),
          onView: () => triggerAction('view', data),
          onEdit: () => triggerAction('fetch', data),
          onCopy: () => triggerAction('copy', data),
          model: data,
          index,
        })}
        data={data}
        enableActionCommands={enableActionCommands}
      />
    );
  };

  /**
   * Render table either using List component or fallback to default Table component
   */
  const renderTable = () => {
    if (!columns?.length) {
      return null;
    }

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

                const props: ActionCommandsProps<TModel> = {
                  onDelete: () => onActionClick?.('delete', data),
                  onView: () => triggerAction('view', data),
                  onEdit: () => triggerAction('fetch', data),
                  onCopy: () => triggerAction('copy', data),
                  model: data,
                  index: cell.row.index,
                  disabled,
                  ...actionCommandsProps,
                };

                if (onActionCommands) {
                  return onActionCommands(props);
                }

                return <ActionCommands {...props} />;
              },
            },
          ]
        : columns,
      // this is for manual server pagination
      rowCount: dataCount || data?.length || 0,
      data,
      loading,
    };

    if (enableRowClickToDetails) {
      props.onRowClick = (_e, row) => {
        triggerAction(
          typeof enableRowClickToDetails === 'string' ? enableRowClickToDetails : 'view',
          row.original,
        );
      };
    }

    const tableNode = onCustomTable ? (
      onCustomTable(props as TableProps<TModel>)
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
    if (!detailPageProps?.open || !onDetailPage) {
      return null;
    }

    const reason = detailPageProps.reason!;
    const isDisabled = detailPageProps.disabled;
    const title = {
      fetch: t('edit'),
      copy: t('tags.copy'),
      create: createCommandLabel ?? t('newitem'),
      view: t('browse'),
    };
    const props: DetailPageModalProps<TModel> | DetailPageDrawerProps<TModel> = {
      enableCreate: true,
      enableCopy: true,
      enableDiscardChanges: false,
      header: isDisabled ? t('browse') : title[reason],
      helperText: reason === 'copy' ? t('tags.copy') : null,
      createCommandLabel,
      onAfterSave: (result, { reason, mode }) => {
        switch (mode) {
          case 'save':
            if (reason === 'create' && result) {
              triggerAction('fetch', result as TModel);
            }
            break;
          case 'save-close':
          case 'save-create':
            if (enableRefetch) {
              onSearch();
            }
            break;
        }
      },
      onAfterDelete: () => {
        if (enableRefetch) {
          onSearch();
        }
      },
      ...detailPageProps,
    };

    const detailPageContent =
      typeof onDetailPage === 'function'
        ? onDetailPage(props, openDetailPage)
        : onDetailPage[reason]?.(props, openDetailPage);
    return detailPageContent;
  };

  /* -------------------------------------------------------------------------- */
  /*                              ListPage Context                              */
  /* -------------------------------------------------------------------------- */

  const contextValue = useMemo<ListPageContextType<TModel>>(
    () => ({
      triggerAction,
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
      triggerAction,
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
