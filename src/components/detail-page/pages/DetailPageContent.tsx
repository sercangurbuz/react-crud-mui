import React, { ReactNode, useMemo } from 'react';
import { FieldValues } from 'react-hook-form';

import ValidationAlerts from '../../form/components/ValidationAlerts';
import { HeaderProps } from '../../header/Header';
import useTranslation from '../../i18n/hooks/useTranslation';
import Edit from '../../icons/Edit';
import Alerts from '../../page/components/Alerts';
import { Message } from '../../page/hooks/useNormalizeMessages';
import Page, { PageProps } from '../../page/Page';
import { ServerError } from '../../utils';
import AutoSave from '../components/AutoSave';
import DetailPageCommands, { DetailPageCommandsProps } from '../components/DetailPageCommands';
import DetailPageDefaultLayout, {
  DetailPageLayoutProps,
} from '../components/DetailPageDefaultLayout';
import DetailPageHeader, { DetailPageHeaderProps } from '../components/DetailPageHeader';
import DetailPageShortCuts from '../components/DetailPageShortCuts';
import DetailPageStepCommands, {
  DetailPageStepCommandsProps,
} from '../components/DetailPageStepCommands';
import DetailPageSteps, { DetailPageStepsProps, StepPane } from '../components/DetailPageSteps';
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
   * External error indicator
   */
  error?: ServerError;
  /**
   * Alerts
   */
  alerts?: Message[];
  /**
   * Active segment index (tab of step)
   */
  activeSegmentIndex?: number;
  /**
   * Event that fired with current index when active segment is changed
   */
  onSegmentChanged?: (index: number) => void;
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
  /**
   * Steps definitons
   */
  steps?: StepPane[];
  /**
   * Custom steps component
   */
  customSteps?: React.ComponentType<DetailPageStepsProps>;
  /**
   * Optional steps props
   */
  stepsProps?: Partial<DetailPageStepsProps>;
}

function DetailPageContent<TModel extends FieldValues>({
  activeSegmentIndex = 0,
  alerts,
  autoSave,
  children,
  commandsPosition,
  component: RenderComponent,
  customSteps: CustomSteps,
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
  error,
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
  steps,
  stepsProps,
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
    const stepsContent = renderSteps();

    const props: DetailPageLayoutProps = {
      content,
      autoSaveContent,
      stepsContent,
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
    const isStepper = !!steps?.length;
    return isStepper ? renderStepsCommands() : renderStandartCommands();
  };

  /**
   * Render standart commands
   */
  const renderStandartCommands = () => {
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

  const renderSteps = () => {
    if (!steps && !CustomSteps) {
      return null;
    }

    const Steps = CustomSteps ?? DetailPageSteps;
    return (
      <Steps
        items={steps!}
        disabled={disabled}
        status={loading ? 'wait' : error ? 'error' : 'process'}
        activeStep={activeSegmentIndex}
        onChange={onSegmentChanged}
        {...stepsProps}
      />
    );
  };

  /**
   * Render steps commands
   */
  const renderStepsCommands = () => {
    if (!steps?.length) {
      return null;
    }

    const nextButtonTitle =
      activeSegmentIndex < steps.length - 1 ? steps[activeSegmentIndex + 1].label : undefined;
    const prevButtonTitle =
      activeSegmentIndex > 0 ? steps[activeSegmentIndex - 1].label : undefined;

    const props: DetailPageStepCommandsProps = {
      onNextClick: () => onSegmentChanged?.(activeSegmentIndex + 1),
      onPrevClick: () => onSegmentChanged?.(activeSegmentIndex - 1),
      onFinish: onSave,
      nextButtonTitle,
      prevButtonTitle,
      commands: stepsProps?.commands,
      options: {
        showNextButton: !!nextButtonTitle,
        showPrevButton: !!prevButtonTitle,
        disableNextButton: disabled,
        disablePrevButton: disabled,
        disableFinishButton: disabled,
        showFinishButton: stepsProps?.showFinishButton ?? true,
        activeStepIndex: activeSegmentIndex,
        currentKey: steps[activeSegmentIndex].key,
        steps,
      },
    };

    return <DetailPageStepCommands {...props} />;
  };

  /**
   * Renders BasePage and its content without Form component
   * @param content Component,children,tabs or steps nodes
   * @param commands Commands nodes
   */
  const renderPage = (content: ReactNode, commands: ReactNode, alertsContent: ReactNode) => {
    const isStepper = !!steps?.length;
    return (
      <Page
        icon={<Edit />}
        title={reason === 'fetch' ? t('edit') : t('newitem')}
        {...pageProps}
        disabled={disabled || loading}
        commandsContent={commands}
        commandsPosition={isStepper ? 'bottom' : commandsPosition}
        onHeader={renderPageHeader}
        onClose={onClose}
        loading={loading}
        alertsContent={alertsContent}
        onTabChanged={onSegmentChanged}
        selectedTabIndex={activeSegmentIndex}
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
      activeSegmentIndex,
      onSave,
      setActiveSegmentIndex: onSegmentChanged!,
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
      activeSegmentIndex,
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
