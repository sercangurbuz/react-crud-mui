import { ReactNode } from 'react';

import Step, { StepProps } from '@mui/material/Step';
import StepLabel, { StepLabelProps } from '@mui/material/StepLabel';
import Stepper, { StepperProps } from '@mui/material/Stepper';

import Field from '../../form/Field';
import Page from '../../page/Page';
import { DetailPageStepCommandsProps } from './DetailPageStepCommands';

/* -------------------------------------------------------------------------- */
/*                                    Types                                   */
/* -------------------------------------------------------------------------- */

export interface DetailPageStepsProps extends Omit<StepperProps, 'onChange'> {
  items: StepPane[];
  status?: StepStatus;
  showFinishButton?: DetailPageStepCommandsProps['options']['showFinishButton'];
  finishButtonText?: DetailPageStepCommandsProps['options']['finishButtonText'];
  onCommands?: DetailPageStepCommandsProps['onCommands'];
}

export type StepPane = Omit<StepProps & StepLabelProps, 'children' | 'key'> & {
  key: string;
  label: ReactNode;
  children: ReactNode;
};
export type StepStatus = 'wait' | 'process' | 'finish' | 'error';

/* -------------------------------------------------------------------------- */
/*                                   Styled                                   */
/* -------------------------------------------------------------------------- */

function DetailPageSteps({ activeStep = 0, items, status, ...stepperProps }: DetailPageStepsProps) {
  /* -------------------------------------------------------------------------- */
  /*                                   Render                                   */
  /* -------------------------------------------------------------------------- */

  const isStepError = (index: number) => {
    return activeStep === index && status === 'error';
  };

  return (
    <>
      <Page.Content sx={{ py: 2 }}>
        <Stepper {...stepperProps} activeStep={activeStep}>
          {items.map(
            ({ key, completed, disabled, expanded, error, icon, optional, label }, index) => (
              <Step key={key} completed={completed} disabled={disabled} expanded={expanded}>
                <StepLabel error={isStepError(index) ?? error} icon={icon} optional={optional}>
                  {label}
                </StepLabel>
              </Step>
            ),
          )}
        </Stepper>
      </Page.Content>
      {/* Step Content */}
      <Field.Group group={items[activeStep].key}>{items[activeStep].children}</Field.Group>
    </>
  );
}

export default DetailPageSteps;
