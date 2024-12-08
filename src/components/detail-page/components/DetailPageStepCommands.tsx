import React, { ReactNode } from 'react';

import { ArrowLeft, ArrowRight, Save } from '@mui/icons-material';
import LoadingButton from '@mui/lab/LoadingButton';
import { Box, Button } from '@mui/material';

import useSettings from '../../crud-mui-provider/hooks/useSettings';
import { FlexBetween } from '../../flexbox';
import useFormGroupIsInValid from '../../form/hooks/useFormGroupIsInValid';
import useTranslation from '../../i18n/hooks/useTranslation';
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
  finishButtonText?: string;
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
  onCommands?: (props: StepCommandsComponentProps) => ReactNode;
}

export enum DetailPageStepCommandNames {
  PREV = 'prev',
  NEXT = 'next',
}

/* ------------------------- StepsButtons Component ------------------------- */

function DetailPageStepCommands({ onCommands, ...stepCommandProps }: DetailPageStepCommandsProps) {
  const {
    nextButtonTitle,
    prevButtonTitle,
    onNextClick,
    onPrevClick,
    onFinish,
    options: {
      finishButtonText,
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
  } = stepCommandProps;

  /* ---------------------------------- Hooks --------------------------------- */

  const { t } = useTranslation();
  const {
    hotkeys: { nextStep: SHORTCUT_NEXT_STEP, prevStep: SHORTCUT_PREV_STEP },
  } = useSettings();
  const isInValid = useFormGroupIsInValid({ groupName: currentKey });
  const isNextButtonDisabled = isInValid || disableNextButton;
  const isFinishButtonDisabled = isInValid || disableFinishButton;

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
        {prevButtonTitle}
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
        disabled={isNextButtonDisabled}
        endIcon={<ArrowRight />}
        title={`${t('nextstep')}\n(${SHORTCUT_NEXT_STEP.toUpperCase()})`}
      >
        {nextButtonTitle}
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
        disabled={isFinishButtonDisabled}
        startIcon={<Save />}
      >
        {finishButtonText || t('finish')}
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

    if (onCommands) {
      return onCommands({
        ...stepCommandProps,
        options: {
          ...stepCommandProps.options,
          disableNextButton: isNextButtonDisabled,
          disableFinishButton: isFinishButtonDisabled,
        },
        finish: finishContent,
        next: nextContent,
        prev: prevContent,
      });
    }

    return layout;
  };

  return <>{renderCommands()}</>;
}

export default DetailPageStepCommands;
