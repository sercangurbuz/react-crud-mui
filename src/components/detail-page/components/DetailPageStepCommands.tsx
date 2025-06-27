import React, { ReactNode } from 'react';
import { useFormState } from 'react-hook-form';

import ArrowLeft from '@mui/icons-material/ArrowLeft';
import ArrowRight from '@mui/icons-material/ArrowRight';
import Save from '@mui/icons-material/Save';
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

import useSettings from '../../crud-mui-provider/hooks/useSettings';
import { FlexBetween } from '../../flexbox';
import { UseFormReturn } from '../../form/hooks/useForm';
import useTranslation from '../../i18n/hooks/useTranslation';
import { StepPane } from './DetailPageStepsHeader';

/* ---------------------------------- Types --------------------------------- */

export type StepsButtonsOptions = {
  showNextButton?: boolean;
  showPrevButton?: boolean;
  currentKey: React.Key;
  name: string;
  activeStepIndex: number;
  steps: StepPane[];
  showFinishButton?: boolean;
  finishButtonText?: string;
  loading?: boolean;
  currentForm?: UseFormReturn;
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

export type DetailPageStepCommandsProps = StepCommandsStates;

export enum DetailPageStepCommandNames {
  PREV = 'prev',
  NEXT = 'next',
}

/* ------------------------- StepsButtons Component ------------------------- */

function DetailPageStepCommands(props: DetailPageStepCommandsProps) {
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
      loading,
      activeStepIndex,
      steps,
      showFinishButton,
      currentForm,
    },
  } = props;

  /* ---------------------------------- Hooks --------------------------------- */

  const { t } = useTranslation();
  const {
    hotkeys: { nextStep: SHORTCUT_NEXT_STEP, prevStep: SHORTCUT_PREV_STEP },
  } = useSettings();
  const { isValid: isCurrentStepValid } = useFormState({
    control: currentForm?.control,
    disabled: !currentForm,
  });

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
        disabled={!isCurrentStepValid}
        endIcon={<ArrowRight />}
        title={`${t('nextstep')}\n(${SHORTCUT_NEXT_STEP.toUpperCase()})`}
      >
        {nextButtonTitle}
      </LoadingButton>
    );
  };

  const renderFinish = () => {
    return (
      <LoadingButton
        key="finish"
        onClick={onFinish}
        color="success"
        loading={loading}
        disabled={!isCurrentStepValid}
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
          {showFinishButton && steps.length === activeStepIndex + 1 ? finishContent : null}
          {nextContent}
        </Box>
      </FlexBetween>
    );

    return layout;
  };

  return <>{renderCommands()}</>;
}

export default DetailPageStepCommands;
