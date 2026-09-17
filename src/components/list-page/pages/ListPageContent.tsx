import React, { ReactNode, useCallback, useEffect, useRef } from 'react';
import { FieldValues } from 'react-hook-form';

import { Box } from '@mui/material';

import ActionTable, { ActionProps, ActionTableProps } from '../../action-table/ActionTable';
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
import ListPageDefaultLayout, { ListPageLayoutProps } from '../components/ListPageDefaultLayout';
import ListPageHeader, { ListPageHeaderProps } from '../components/ListPageHeader';
import ListPageProvider from '../components/ListPageProvider';
import ListPageShortCuts from '../components/ListPageShortCuts';

/* -------------------------------------------------------------------------- */
/*                                    Types                                   */
/* -------------------------------------------------------------------------- */

export type ListType = 'table' | 'card';

export type ListPageWrapperLayoutProps = {
  tableContent: ReactNode;
  autoSearchContent: ReactNode;
  shortCutContent: ReactNode;
  pageContent: ReactNode;
  alertsContent: ReactNode;
  commandsContent: ReactNode;
  detailPageContent: ReactNode;
};

type DetailPageRender<TDetailPageModel extends FieldValues> = (
  props: DetailPageModalProps<TDetailPageModel> | DetailPageDrawerProps<TDetailPageModel>,
  open: ReturnType<typeof useDetailPageModal<TDetailPageModel>>[0],
  args?: unknown,
) => ReactNode;

export type OnDetailPage<TDetailPageModel extends FieldValues> =
  | Partial<Record<NeedDataReason, DetailPageRender<TDetailPageModel>>>
  | DetailPageRender<TDetailPageModel>;

export interface ListPageContentProps<TModel extends FieldValues>
  extends Omit<
      PageProps,
      | 'commandsContent'
      | 'alertsContent'
      | 'autoSave'
      | 'onHeader'
      | 'onChange'
      | 'onCopy'
      | 'onLayout'
    >,
    Pick<ListPageCommandsProps, 'commandsProps'> {
  /**
   * Custom commands node
   */
  onCommands?: (props: ListPageCommandsProps) => ReactNode;
  /**
   * Extra commands positioned left side in commands section
   */
  onExtraCommands?: () => ReactNode;
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
   * Event called when user clicks delete action on table or card list
   */
  onDelete?: (model: TModel) => void;
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
   * Show data count on header next to title
   */
  showDataCountOnHeader?: boolean;
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
  onLayout?: (props: ListPageLayoutProps) => React.ReactNode;
  /**
   * Embedded detail page component render function
   */
  onDetailPage?: OnDetailPage<TModel>;
  /**
   * Open detailPage in view mode as default or in which reason provided
   */
  enableRowClickToDetails?: boolean | NeedDataReason | ((model: TModel) => boolean);
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
  /**
   * Offset (in px) reserved above the alerts section when scrolling it into view on error,
   * useful when the consumer app has a sticky/fixed header that would otherwise cover it
   */
  alertsScrollMarginTop?: number;
  /**
   * Action table related props
   */
  actionProps?: Partial<ActionProps<TModel>>;
}

function ListPageContent<TModel extends FieldValues>({
  activeSegmentIndex,
  actionProps,
  alerts,
  alertsScrollMarginTop = 0,
  autoSearch = true,
  cardProps,
  children,
  columns = [],
  commandsProps,
  data,
  dataCount,
  disabled,
  disableShortCuts,
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
  onClear,
  onClose,
  onCommands,
  onCustomTable,
  onDelete,
  onDetailPage,
  onExcelExport,
  onExtraCommands,
  onHeader,
  onLayout,
  onSearch,
  onTabChanged,
  tableProps,
  onWrapperLayout,
  showHeader = true,
  showDataCountOnHeader = true,
  ...pageProps
}: ListPageContentProps<TModel>) {
  /* -------------------------------------------------------------------------- */
  /*                                    Hooks                                   */
  /* -------------------------------------------------------------------------- */

  const { t } = useTranslation();
  const alertsContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (error) {
      alertsContainerRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest',
      });
    }
  }, [error]);

  /* ---------------------------- Action DetailPage --------------------------- */

  const [openDetailPage, detailPageProps] = useDetailPageModal<TModel>({
    models: data,
    uniqueIdParamName: tableProps?.rowIdField ?? DEFAULT_ROW_KEY_FIELD,
  });

  const triggerAction = useCallback(
    (reason: NeedDataReason, data?: TModel, args?: unknown) => {
      const useDetailPage = typeof onDetailPage === 'function' ? true : !!onDetailPage?.[reason];

      if (useDetailPage) {
        return openDetailPage({
          data,
          reason,
          disabled,
          args,
        });
      }
      //call fallback action handler
      actionProps?.onActionClick?.(reason, data, args);
    },
    [actionProps, disabled, onDetailPage, openDetailPage],
  );

  /* -------------------------------------------------------------------------- */
  /*                               Render Helpers                               */
  /* -------------------------------------------------------------------------- */

  /**
   * Renders customization component of whole detailpage
   */
  const renderWrapperLayout = () => {
    const tableContent = listType === 'card' ? renderCard() : renderTable();
    const alertsContent = renderAlerts();
    const commandsContent = renderCommands();
    const autoSearchContent = renderAutoSearch();
    const shortCutContent = renderShortCuts();

    const pageContent = renderPage(commandsContent, alertsContent, filterContent, tableContent);

    const detailPageContent = renderDetailPage();

    const props: ListPageWrapperLayoutProps = {
      tableContent,
      pageContent,
      commandsContent,
      alertsContent,
      detailPageContent,
      autoSearchContent,
      shortCutContent,
    };

    if (onWrapperLayout) {
      return onWrapperLayout(props);
    }

    return (
      <>
        {pageContent}
        {detailPageContent}
        {autoSearchContent}
        {shortCutContent}
      </>
    );
  };

  /**
   * Renders BasePage and its content without Form component
   * @param content Component,children,tabs or steps nodes
   * @param commands Commands nodes
   */
  const renderPage = (
    commands: ReactNode,
    alertsContent: ReactNode,
    filterContent: ReactNode,
    tableContent: ReactNode,
  ) => {
    return (
      <Page
        icon={<SearchIcon sx={{ color: 'primary.main' }} />}
        {...pageProps}
        morePanelProps={{
          moreText: t('listpage.showmorefilter'),
          lessText: t('listpage.showlessfilter'),
          sx: { pt: 0, justifyContent: 'center' },
          ...pageProps?.morePanelProps,
        }}
        disabled={disabled}
        commandsContent={commands}
        onHeader={renderPageHeader}
        onClose={onClose}
        loading={loading}
        alertsContent={alertsContent}
        onTabChanged={onTabChanged}
        selectedTabIndex={activeSegmentIndex}
        onLayout={(props) =>
          onLayout ? (
            onLayout({ ...props, filterContent, tableContent })
          ) : (
            <ListPageDefaultLayout
              {...props}
              filterContent={filterContent}
              tableContent={tableContent}
            />
          )
        }
      >
        {children}
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
      dataCount: dataCount ?? data?.length ?? 0,
      showDataCount: showDataCountOnHeader,
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
    const props: ListPageCommandsProps = {
      onExcelExport,
      onSearch,
      onCreateItem: (args) => triggerAction('create', undefined, args),
      onClear,
      commandsProps,
    };

    if (onCommands) {
      return onCommands(props);
    }

    const extraCommandContent = onExtraCommands?.();

    return <ListPageCommands {...props}>{extraCommandContent}</ListPageCommands>;
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
      <Box ref={alertsContainerRef} sx={{ scrollMarginTop: alertsScrollMarginTop }}>
        <Alerts messages={messages} />
        <ValidationAlerts />
      </Box>
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
        loading={loading}
        onActionCommandProps={(data, index) => ({
          onDelete: () => actionProps?.onActionClick?.('delete', data),
          onView: () => triggerAction('view', data),
          onEdit: () => triggerAction('fetch', data),
          onCopy: () => triggerAction('copy', data),
          model: data,
          index,
        })}
        data={data}
        enableActionCommands={actionProps?.enableActionCommands}
      />
    );
  };

  /**
   * Render table either using List component or fallback to default Table component
   */
  const renderTable = () => {
    const props: ActionTableProps<TModel> = {
      newRowButtonText: commandsProps?.create?.children ?? t('newitem'),
      onNewRow: () => triggerAction('create'),
      highlightedRowIndex: detailPageProps?.index,
      ...tableProps,
      columns,
      ...actionProps,
      onActionClick: (action, data, args, props) => {
        if (action === 'delete') {
          actionProps?.onActionClick?.('delete', data, args, props);
          onDelete?.(data!);
        } else {
          triggerAction(action, data, args);
        }
      },
      // this is for manual server pagination
      rowCount: dataCount || data?.length || 0,
      data: data ?? [],
      loading,
    };

    if (enableRowClickToDetails) {
      props.onRowClick = (_e, row) => {
        if (typeof enableRowClickToDetails === 'function') {
          const isEnabled = enableRowClickToDetails(row.original);
          if (!isEnabled) {
            return;
          }
        }

        triggerAction(
          typeof enableRowClickToDetails === 'string' ? enableRowClickToDetails : 'view',
          row.original,
        );
      };
    }

    const tableNode = onCustomTable ? (
      onCustomTable(props as TableProps<TModel>)
    ) : actionProps ? (
      <ActionTable {...props} />
    ) : (
      <Table {...props} />
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
      create: commandsProps?.create?.children ?? t('newitem'),
      view: t('browse'),
    };
    const props: DetailPageModalProps<TModel> | DetailPageDrawerProps<TModel> = {
      enableCreate: true,
      enableCopy: true,
      enableDiscardChanges: false,
      header: isDisabled ? t('browse') : title[reason],
      commandsProps: {
        create: {
          children: commandsProps?.create?.children ?? t('newitem'),
        },
      },
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
        ? onDetailPage(props, openDetailPage, detailPageProps.args)
        : onDetailPage[reason]?.(props, openDetailPage, detailPageProps.args);
    return detailPageContent;
  };

  /* --------------------------------- Render --------------------------------- */

  return (
    <ListPageProvider
      triggerAction={triggerAction}
      loading={loading}
      data={data}
      search={onSearch}
      clear={onClear!}
      enableClear={enableClear}
      enableCreateItem={enableCreateItem}
      enableExport={enableExport}
      enableSearch={enableSearch}
    >
      {renderWrapperLayout()}
    </ListPageProvider>
  );
}

export default ListPageContent;
