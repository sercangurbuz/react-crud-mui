import React, { ReactNode, useEffect, useRef } from 'react';
import { FieldValues, Path, PathValue } from 'react-hook-form';

import { Box } from '@mui/material';

import ValidationAlerts from '../../form/components/ValidationAlerts';
import { UseFormReturn } from '../../form/hooks/useForm';
import useFormCollectionContext from '../../form/hooks/useFormCollectionContext';
import { HeaderProps } from '../../header/Header';
import useTranslation from '../../i18n/hooks/useTranslation';
import Alerts from '../../page/components/Alerts';
import { Message } from '../../page/hooks/useNormalizeMessages';
import Page, { PageProps } from '../../page/Page';
import { ServerError } from '../../utils';
import AutoSave, { AutoSaveOptions } from '../components/AutoSave';
import DetailPageCommands, {
  CommandsProps,
  CommandsPropsFn,
  DetailPageCommandsOptions,
  DetailPageCommandsProps,
} from '../components/DetailPageCommands';
import DetailPageDefaultLayout, {
  DetailPageLayoutOptions,
  DetailPageLayoutProps,
} from '../components/DetailPageDefaultLayout';
import DetailPageHeader, { DetailPageHeaderProps } from '../components/DetailPageHeader';
import DetailPageProvider from '../components/DetailPageProvider';
import DetailPageShortCuts from '../components/DetailPageShortCuts';
import DetailPageStepForm from '../components/DetailPageStepForm';
import DetailPageStepsHeader, {
  DetailPageStepsHeaderProps,
  StepPane,
} from '../components/DetailPageStepsHeader';
import SuccessPanel, { SuccessPanelProps } from '../components/SuccessPanel';
import { DETAILPAGE_HOTKEYS_SCOPE } from '../hooks/useDetailPageHotKeys';
import { NavigationDirection, SaveMode } from './DetailPageData';

/* -------------------------------------------------------------------------- */
/*                                    Types                                   */
/* -------------------------------------------------------------------------- */

export type NeedDataReason = 'create' | 'fetch' | 'copy' | 'view';

export type DetailPageWrapperLayoutProps<TModel extends FieldValues = FieldValues> = {
  content: ReactNode;
  pageContent: ReactNode;
  commandsContent: ReactNode;
  alertsContent: ReactNode;
  options: DetailPageLayoutOptions<TModel>;
};

/* ------------------------- DetailPageContentProps ------------------------- */

export interface DetailPageContentProps<TModel extends FieldValues>
  extends Omit<
    PageProps,
    'commandsContent' | 'alertsContent' | 'autoSave' | 'onHeader' | 'tabExtraContent'
  > {
  commandsProps?: CommandsProps | CommandsPropsFn;
  /**
   * Custom commands node
   */
  onCommands?: (props: DetailPageCommandsProps) => ReactNode;
  /**
   * Extra commands positioned left side in commands section
   */
  onExtraCommands?: () => ReactNode;
  /**
   * Main rhf instance of page
   */
  form: UseFormReturn<TModel>;
  /*
   * Page model
   */
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
  /**
   * Navigation callback when one of which navigate buttons is pressed
   */
  onNavigate: (direction: NavigationDirection) => void;
  /**
   * Custom header function
   */
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
  autoSave?: boolean | AutoSaveOptions;
  /**
   * Readonly mode, when true all commands are disabled except commands unlike disabled
   */
  readOnly?: boolean;
  /**
   *  Custom content layout
   */
  onContentLayout?: (props: DetailPageLayoutProps<TModel>) => React.ReactNode;
  onWrapperLayout?: (props: DetailPageWrapperLayoutProps<TModel>) => React.ReactNode;
  /**
   *Default save mode (save,saveclose,savecreate) default is 'save'
   */
  defaultSaveMode?: SaveMode;
  /**
   * Steps definitons
   */
  steps?: StepPane<TModel>[];
  /**
   * Custom steps component
   */
  customSteps?: React.ComponentType<DetailPageStepsHeaderProps>;
  /**
   * Optional steps props
   */
  stepsProps?: Partial<DetailPageStepsHeaderProps>;
  /**
   * Extra content to be placed in tab bar area
   */
  tabExtraContent?: ReactNode | ((data?: TModel) => ReactNode);
  /**
   * Show success panel on create/save (Default false
   */
  successPanelVisible?: boolean;
  /**
   * Show success panel on create/save (Default false)
   */
  successPanelProps?:
    | SuccessPanelProps
    | ((
        model: TModel,
        events: Pick<DetailPageContentProps<TModel>, 'onCreate' | 'onClose'>,
      ) => SuccessPanelProps);
  /**
   * Custom render for success panel
   */
  onSuccessPanel?: (
    model: TModel,
    events: Pick<DetailPageContentProps<TModel>, 'onCreate' | 'onClose'>,
  ) => React.ReactNode;
}

function DetailPageContent<TModel extends FieldValues>({
  activeSegmentIndex = 0,
  alerts,
  autoSave,
  children,
  commandsPosition,
  commandsProps,
  customSteps: CustomSteps,
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
  form,
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
  onNavigate,
  onSave,
  onSaveClose,
  onSaveCreate,
  onWrapperLayout,
  readOnly,
  reason = 'create',
  showHeader = true,
  steps,
  stepsProps,
  successPanelVisible,
  successPanelProps,
  onSuccessPanel,
  tabExtraContent,
  ...pageProps
}: DetailPageContentProps<TModel>) {
  /* -------------------------------------------------------------------------- */
  /*                                    Hooks                                   */
  /* -------------------------------------------------------------------------- */

  const { t } = useTranslation();
  const alertsContainerRef = useRef<HTMLDivElement | null>(null);
  const { forms } = useFormCollectionContext();

  useEffect(() => {
    if (error) {
      alertsContainerRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest',
      });
    }
  }, [error]);

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
    const successPanelContent = renderSuccessPanel();
    const pageContent = successPanelVisible
      ? renderPage(successPanelContent, null, null)
      : renderPage(content, commandsContent, alertsContent);

    const props: DetailPageWrapperLayoutProps<TModel> = {
      content,
      pageContent,
      commandsContent,
      alertsContent,
      options: {
        loading,
        reason,
        data,
      },
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
    const content = children;
    const autoSaveContent = renderAutoSave();
    const stepsContent = renderSteps();

    const props: DetailPageLayoutProps<TModel> = {
      content,
      autoSaveContent,
      stepsContent,
      options: {
        loading,
        reason,
        data,
      },
    };

    if (onContentLayout) {
      return onContentLayout(props);
    }

    return <DetailPageDefaultLayout {...props} />;
  };

  /**
   * Call search on every form changes
   */
  const renderAutoSave = () => {
    if (!autoSave) {
      return null;
    }

    const options: AutoSaveOptions = typeof autoSave === 'object' ? autoSave : { delay: 500 };
    return <AutoSave onAutoSave={onSave} {...options} />;
  };

  /**
   * Merge server errors and client alerts
   */
  const renderAlerts = () => {
    return (
      <Box ref={alertsContainerRef}>
        <Alerts messages={alerts} />
        <ValidationAlerts />
      </Box>
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
    const props: DetailPageCommandsProps = {
      mode: 'standard',
      onCreate,
      onCopy,
      onSave,
      onSaveCreate,
      onSaveClose,
      onDelete,
      onDiscardChanges,
      onClose,
      onNavigate,
      options: {
        saveCommandMode: defaultSaveMode,
        reason,
      } as DetailPageCommandsOptions,
      commandsProps: typeof commandsProps === 'function' ? commandsProps(reason) : commandsProps,
    };

    if (onCommands) {
      return onCommands(props);
    }

    const extraCommandContent = onExtraCommands?.();

    return <DetailPageCommands {...props}>{extraCommandContent}</DetailPageCommands>;
  };

  /**
   * Render steps commands
   */
  const renderStepsCommands = () => {
    if (!steps?.length) {
      return null;
    }

    const currentKey = steps[activeSegmentIndex].key;
    const currentFieldName = steps[activeSegmentIndex].name;
    const currentForm = currentFieldName && forms.get(currentFieldName);

    const nextButtonTitle =
      activeSegmentIndex < steps.length - 1 ? steps[activeSegmentIndex + 1].label : undefined;
    const prevButtonTitle =
      activeSegmentIndex > 0 ? steps[activeSegmentIndex - 1].label : undefined;

    const updateParentForm = () => {
      if (!currentForm) {
        return;
      }

      form.setValue(currentFieldName, currentForm.getValues() as PathValue<TModel, Path<TModel>>, {
        shouldValidate: true,
        shouldDirty: true,
      });
    };

    const resetSteps = () => {
      onDiscardChanges?.();
      onSegmentChanged?.(0);
    };

    const props: DetailPageCommandsProps = {
      mode: 'steps',
      commandsProps: typeof commandsProps === 'function' ? commandsProps(reason) : commandsProps,
      onNextClick: () => {
        updateParentForm();
        onSegmentChanged?.(activeSegmentIndex + 1);
      },
      onPrevClick: () => {
        updateParentForm();
        onSegmentChanged?.(activeSegmentIndex - 1);
      },
      onSave() {
        updateParentForm();
        onSave();
      },
      onSaveCreate() {
        updateParentForm();
        onSaveCreate();
      },
      onSaveClose() {
        updateParentForm();
        onSaveClose();
      },
      onClose: () => {
        resetSteps();
        onClose?.();
      },
      onDiscardChanges,
      onCreate,
      onCopy,
      onDelete,
      options: {
        reason,
        nextButtonTitle,
        prevButtonTitle,
        showNextButton: !!nextButtonTitle,
        showPrevButton: !!prevButtonTitle,
        activeStepIndex: activeSegmentIndex,
        steps,
        currentKey,
        currentForm,
        name: currentFieldName as string,
        saveCommandMode: defaultSaveMode,
      },
    };

    if (onCommands) {
      return onCommands(props);
    }

    const extraCommandContent = onExtraCommands?.();

    return <DetailPageCommands {...props}>{extraCommandContent}</DetailPageCommands>;
  };

  /**
   * DstailPage header node
   */
  const renderPageHeader = (props: HeaderProps) => {
    if (!showHeader) {
      return null;
    }

    const phProps: DetailPageHeaderProps = {
      ...props,
      reason,
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
        defaultSaveMode={defaultSaveMode}
      />
    );
  };

  /**
   * Render steps header and content
   */
  const renderSteps = () => {
    if (!steps?.length) {
      return null;
    }

    const StepHeaders = CustomSteps ?? DetailPageStepsHeader;
    const stepHeaders = (
      <StepHeaders items={steps} activeStep={activeSegmentIndex} {...stepsProps} />
    );

    const renderStep = ({
      children,
      name,
      schema,
      validationOptions,
      defaultValues,
      key,
    }: StepPane) => {
      return name ? (
        <DetailPageStepForm
          key={key}
          name={name}
          schema={schema}
          defaultValues={defaultValues}
          validationOptions={validationOptions}
        >
          {children}
        </DetailPageStepForm>
      ) : (
        children
      );
    };

    return (
      <>
        {stepHeaders}
        {steps.map((step, index) => {
          /* Active Step Content */
          if (index === activeSegmentIndex) {
            return <Box key={step.key}>{renderStep(step)}</Box>;
          }

          /* Render hidden step contents for forceRender steps */
          if (step.forceRender) {
            return (
              <Box key={step.key} sx={{ display: 'none' }}>
                {renderStep(step)}
              </Box>
            );
          }
        })}
      </>
    );
  };

  const renderSuccessPanel = () => {
    if (!successPanelVisible || !successPanelProps) {
      return null;
    }

    const successPanelPropsResolved =
      typeof successPanelProps === 'object'
        ? successPanelProps
        : successPanelProps?.(form.getValues(), {
            onCreate,
            onClose: () => onClose?.('close-button'),
          });

    const helperEvents = {
      onCreate,
      onClose: () => onClose?.('close-button'),
    };

    return onSuccessPanel ? (
      onSuccessPanel(form.getValues(), helperEvents)
    ) : (
      <SuccessPanel title={t('savedsuccesfully')} {...successPanelPropsResolved} />
    );
  };

  /**
   * Renders BasePage and its content without Form component
   * @param content Component,children,tabs or steps nodes
   * @param commands Commands nodes
   */
  const renderPage = (content: ReactNode, commands: ReactNode, alertsContent: ReactNode) => {
    const isStepper = !!steps?.length;
    const tabContent =
      typeof tabExtraContent === 'function' ? tabExtraContent(data) : tabExtraContent;
    return (
      <Page
        title={reason === 'fetch' ? t('edit') : reason === 'view' ? t('browse') : t('newitem')}
        tabsPosition="in-subrow"
        {...pageProps}
        tabExtraContent={tabContent}
        disabled={disabled || readOnly || loading || reason === 'view'}
        commandsContent={commands}
        commandsPosition={isStepper ? 'bottom-between' : commandsPosition}
        onHeader={renderPageHeader}
        onClose={onClose}
        loading={loading}
        alertsContent={alertsContent}
        onTabChanged={({ selectedTabIndex }) => onSegmentChanged?.(selectedTabIndex)}
        selectedTabIndex={activeSegmentIndex}
      >
        {content}
        {/* Shortcuts */}
        {renderShortCuts()}
      </Page>
    );
  };

  /* -------------------------------------------------------------------------- */
  /*                                   Render                                   */
  /* -------------------------------------------------------------------------- */

  return (
    <DetailPageProvider
      data={data}
      reason={reason}
      loading={loading}
      enableCopy={enableCopy && enableCreate}
      enableClose={enableClose}
      enableCreate={enableCreate}
      enableDelete={enableDelete}
      enableDiscardChanges={enableDiscardChanges}
      enableSave={enableSave}
      disabled={disabled}
      activeSegmentIndex={activeSegmentIndex}
      onSave={onSave}
      setActiveSegmentIndex={onSegmentChanged!}
    >
      {renderWrapperLayout()}
    </DetailPageProvider>
  );
}

export default DetailPageContent;
