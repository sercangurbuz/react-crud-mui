import React, { Key, ReactNode } from 'react';

import { ArrowLeft, ArrowRight, Save } from '@mui/icons-material';
import LoadingButton from '@mui/lab/LoadingButton';
import { Box, Button } from '@mui/material';

import { FlexBetween } from '../../flexbox';
import useFormGroupIsInValid from '../../form/hooks/useFormGroupIsInValid';
import useTranslation from '../../i18n/hooks/useTranslation';
import useSettings from '../../settings-provider/hooks/useSettings';
import { StepPane } from './DetailPageSteps';

/* ---------------------------------- Types --------------------------------- */

export type StepsButtonsOptions = {
  showNextButton?: boolean;
  showPrevButton?: boolean;
  disableNextButton?: boolean;
  disablePrevButton?: boolean;
  disableFinishButton?: boolean;
  currentKey: string;
  activeStepIndex: number;
  steps: StepPane[];
  showFinishButton?: boolean;
  loading?: boolean;
};

export type StepCommandsStates = {
  onNextClick?: () => void;
  onPrevClick?: () => void;
  onFinish?: () => void;
  nextButtonTitle?: React.ReactNode;
  prevButtonTitle?: React.ReactNode;
  options: StepsButtonsOptions;
};

export type StepCommandsLayout = {
  prev: ReactNode;
  next: ReactNode;
  finish: ReactNode;
};

export type StepCommandsComponentProps = StepCommandsStates & StepCommandsLayout;

export interface DetailPageStepCommandsProps extends StepCommandsStates {
  commands?: React.ComponentType<StepCommandsComponentProps>;
}

// eslint-disable-next-line react-refresh/only-export-components
export enum DetailPageStepCommandNames {
  PREV = 'prev',
  NEXT = 'next',
}

/* ------------------------- StepsButtons Component ------------------------- */

function DetailPageStepCommands({
  commands: CustomCommands,
  ...options
}: DetailPageStepCommandsProps) {
  const {
    onNextClick,
    onPrevClick,
    onFinish,
    nextButtonTitle,
    prevButtonTitle,
    options: {
      showNextButton,
      showPrevButton,
      disableNextButton,
      disablePrevButton,
      disableFinishButton,
      loading,
      currentKey,
      activeStepIndex,
      steps,
      showFinishButton,
    },
  } = options;

  /* ---------------------------------- Hooks --------------------------------- */

  const { t } = useTranslation();
  const {
    hotkeys: { nextStep: SHORTCUT_NEXT_STEP, prevStep: SHORTCUT_PREV_STEP },
  } = useSettings();
  const isInValid = useFormGroupIsInValid({ groupName: currentKey });

  /* -------------------------------------------------------------------------- */
  /*                               Render helpers                               */
  /* -------------------------------------------------------------------------- */

  const renderPrev = () => {
    if (!showPrevButton) {
      return null;
    }

    return (
      <Button
        key="prev"
        variant="outlined"
        onClick={onPrevClick}
        startIcon={<ArrowLeft />}
        color="secondary"
        disabled={disablePrevButton}
        title={`${t('prevstep')}\n(${SHORTCUT_PREV_STEP.toUpperCase()})`}
      >
        {t('prevstep')}
      </Button>
    );
  };

  const renderNext = () => {
    if (!showNextButton) {
      return null;
    }
    return (
      <LoadingButton
        key="next"
        onClick={onNextClick}
        color="primary"
        loading={loading}
        disabled={isInValid || disableNextButton}
        endIcon={<ArrowRight />}
        title={`${t('nextstep')}\n(${SHORTCUT_NEXT_STEP.toUpperCase()})`}
      >
        {t('nextstep')}
      </LoadingButton>
    );
  };

  const renderFinish = () => {
    const visible = showFinishButton && steps.length === activeStepIndex + 1;

    if (!visible) {
      return null;
    }

    return (
      <LoadingButton
        key="finish"
        onClick={onFinish}
        color="success"
        loading={loading}
        disabled={isInValid || disableFinishButton}
        startIcon={<Save />}
      >
        {t('finish')}
      </LoadingButton>
    );
  };

  const renderCommands = () => {
    const prevContent = renderPrev();
    const nextContent = renderNext();
    const finishContent = renderFinish();

    const layout = (
      <FlexBetween width="100%">
        <Box>{prevContent}</Box>
        <Box>
          {finishContent}
          {nextContent}
        </Box>
      </FlexBetween>
    );

    if (CustomCommands) {
      return (
        <CustomCommands {...options} finish={finishContent} next={nextContent} prev={prevContent} />
      );
    }

    return layout;
  };

  return <>{renderCommands()}</>;
}

export default DetailPageStepCommands;
