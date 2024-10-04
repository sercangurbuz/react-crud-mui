import React, { ReactNode, useMemo } from 'react';
import { FieldValues } from 'react-hook-form';

import ValidationAlerts from '../../form/components/ValidationAlerts';
import { HeaderProps } from '../../header/Header';
import useTranslation from '../../i18n/hooks/useTranslation';
import Edit from '../../icons/Edit';
import Alerts from '../../page/components/Alerts';
import { Message } from '../../page/hooks/useNormalizeMessages';
import Page, { PageProps } from '../../page/Page';
import AutoSave from '../components/AutoSave';
import DetailPageCommands, { DetailPageCommandsProps } from '../components/DetailPageCommands';
import DetailPageDefaultLayout, {
  DetailPageLayoutProps,
} from '../components/DetailPageDefaultLayout';
import DetailPageHeader, { DetailPageHeaderProps } from '../components/DetailPageHeader';
import DetailPageShortCuts from '../components/DetailPageShortCuts';
import { DetailPageContext, DetailPageContextType } from '../hooks/useDetailPage';
import { DETAILPAGE_HOTKEYS_SCOPE } from '../hooks/useDetailPageHotKeys';
import { SaveMode } from './DetailPageData';

/* -------------------------------------------------------------------------- */
/*                                    Types                                   */
/* -------------------------------------------------------------------------- */

export type NeedDataReason = 'create' | 'fetch' | 'copy';
export type NavigationDirection = 'next' | 'prev';

export type DetailPageWrapperLayoutProps = {
  content: ReactNode;
  pageContent: ReactNode;
  commandsContent: ReactNode;
  alertsContent: ReactNode;
};

/* ------------------------- DetailPageContentProps ------------------------- */

export interface DetailPageContentProps<TModel extends FieldValues>
  extends Omit<PageProps, 'commandsContent' | 'alertsContent' | 'autoSave' | 'onHeader'>,
    Pick<DetailPageCommandsProps, 'onCommands' | 'onExtraCommands' | 'createCommandLabel'> {
  data?: TModel;
  /**
   * Alerts
   */
  alerts?: Message[];
  /**
   * Active segment index (tab of step)
   */
  activeSegmentValue?: string;
  /**
   * Event that fired with current index when active segment is changed
   */
  onSegmentChanged?: (value: string) => void;
  /**
   * Content component
   */
  component?: React.ComponentType;
  /**
   * Disable all keyboard shortcuts,default all enabled
   */
  disableShortCuts?: boolean;
  /**
   * Hotkeys scope
   */
  hotkeyScopes?: string;
  /**
   * Create new record event
   */
  onCreate?: () => void;
  /**
   * Copy existing model
   */
  onCopy: () => void;
  /**
   * Save event
   */
  onSave: () => void;
  /**
   * Create new model after saving process has been finished
   */
  onSaveCreate: () => void;
  /**
   * Close form after saving process has been finished
   */
  onSaveClose: () => void;
  /**
   * Undo all chnages and revert to originial form values
   */
  onDiscardChanges: () => void;
  /**
   * Delete event
   */
  onDelete: () => void;

  onHeader?: (props: DetailPageHeaderProps) => ReactNode;
  /**
   * Page opening reason Default create.
   */
  reason?: NeedDataReason;
  /**
   * Indicator that enables creating new model
   */
  enableCreate?: boolean;
  /**
   * Indicator that enables coping existing model
   */
  enableCopy?: boolean;
  /**
   * Indicator that enables saving
   */
  enableSave?: boolean;
  /**
   * Indicator that enables closind
   */
  enableClose?: boolean;
  /**
   * Indicator that enables reverting to original values
   */
  enableDiscardChanges?: boolean;
  /**
   * Indicator that enables deleting model
   */
  enableDelete?: boolean;
  /**
   * Having called "onSave" once changing form values
   */
  autoSave?: boolean;
  onContentLayout?: (props: DetailPageLayoutProps) => React.ReactNode;
  onWrapperLayout?: (props: DetailPageWrapperLayoutProps) => React.ReactNode;
  defaultSaveMode?: SaveMode;
}

function DetailPageContent<TModel extends FieldValues>({
  activeSegmentValue,
  alerts,
  autoSave,
  children,
  commandsPosition,
  component: RenderComponent,
  createCommandLabel,
  data,
  defaultSaveMode = 'save',
  disabled,
  disableShortCuts,
  enableClose,
  enableCopy = true,
  enableCreate = true,
  enableDelete,
  enableDiscardChanges,
  enableSave = true,
  hotkeyScopes = DETAILPAGE_HOTKEYS_SCOPE,
  loading,
  onClose,
  onCommands,
  onContentLayout,
  onCopy,
  onCreate,
  onDelete,
  onDiscardChanges,
  onSegmentChanged,
  onExtraCommands,
  onHeader,
  onSave,
  onSaveClose,
  onSaveCreate,
  onWrapperLayout,
  reason = 'create',
  showHeader = true,
  ...pageProps
}: DetailPageContentProps<TModel>) {
  /* -------------------------------------------------------------------------- */
  /*                                    Hooks                                   */
  /* -------------------------------------------------------------------------- */

  const { t } = useTranslation();
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

    const props: DetailPageWrapperLayoutProps = {
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
   * Renders customization component of content
   */
  const renderContentLayout = () => {
    const content = renderContent();
    const autoSaveContent = renderAutoSave();

    const props: DetailPageLayoutProps = {
      content,
      autoSaveContent,
      options: {
        loading,
        reason,
      },
    };

    if (onContentLayout) {
      return onContentLayout(props);
    }

    return <DetailPageDefaultLayout {...props} />;
  };

  /**
   * Render component,children,tabs or steps respectively depending on its definitions
   */
  const renderContent = () => {
    return RenderComponent ? <RenderComponent /> : children;
  };

  /**
   * Call search on every form changes
   */
  const renderAutoSave = () => {
    if (!autoSave) {
      return null;
    }

    return <AutoSave onValuesChange={onSave} />;
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
   * Render commands
   */
  const renderCommands = () => {
    const commandProps: DetailPageCommandsProps = {
      onCreate,
      onCopy,
      onSave,
      onSaveCreate,
      onSaveClose,
      onDelete,
      onDiscardChanges,
      onCommands,
      saveCommandMode: defaultSaveMode,
      onExtraCommands,
      createCommandLabel,
      onClose,
      commandsPosition,
    };

    return <DetailPageCommands {...commandProps} />;
  };

  /**
   * ListPage header node
   */
  const renderPageHeader = (props: HeaderProps) => {
    if (!showHeader) {
      return null;
    }

    const phProps: DetailPageHeaderProps = {
      ...props,
      reason,
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

    return <DetailPageHeader {...phProps} />;
  };

  /**
   * Shortcuts
   */
  const renderShortCuts = () => {
    if (disableShortCuts) {
      return null;
    }

    return (
      <DetailPageShortCuts
        onSave={onSave}
        onSaveClose={onSaveClose}
        onSaveCreate={onSaveCreate}
        onNewItem={onCreate}
        onDelete={onDelete}
        scopes={hotkeyScopes}
      />
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
        icon={<Edit />}
        title={reason === 'fetch' ? t('edit') : t('newitem')}
        {...pageProps}
        disabled={disabled || loading}
        commandsContent={commands}
        commandsPosition={commandsPosition}
        onHeader={renderPageHeader}
        onClose={onClose}
        loading={loading}
        alertsContent={alertsContent}
        onTabChanged={onSegmentChanged}
        selectedTabValue={activeSegmentValue}
      >
        {content}
        {/* Shortcuts */}
        {renderShortCuts()}
      </Page>
    );
  };

  /* -------------------------------------------------------------------------- */
  /*                             DetailPage Context                             */
  /* -------------------------------------------------------------------------- */

  const contextValue = useMemo<DetailPageContextType>(
    () => ({
      data,
      reason,
      loading,
      enableCopy: enableCopy && enableCreate,
      enableClose,
      enableCreate,
      enableDelete,
      enableDiscardChanges,
      enableSave,
      disabled,
      activeSegmentValue,
      onSave,
      setActiveSegment: onSegmentChanged!,
    }),
    [
      data,
      reason,
      loading,
      enableCopy,
      enableCreate,
      enableClose,
      enableDelete,
      enableDiscardChanges,
      enableSave,
      disabled,
      activeSegmentValue,
      onSave,
      onSegmentChanged,
    ],
  );

  /* -------------------------------------------------------------------------- */
  /*                                   Render                                   */
  /* -------------------------------------------------------------------------- */

  return (
    <DetailPageContext.Provider value={contextValue}>
      {renderWrapperLayout()}
    </DetailPageContext.Provider>
  );
}

export default DetailPageContent;
