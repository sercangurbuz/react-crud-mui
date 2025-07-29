import React, { ReactNode } from 'react';
import { DefaultValues, FieldValues, Path, PathValue } from 'react-hook-form';

import Step, { StepProps } from '@mui/material/Step';
import StepLabel, { StepLabelProps } from '@mui/material/StepLabel';
import Stepper, { StepperProps } from '@mui/material/Stepper';
import { z } from 'zod';

import { ValidationOptions } from '../../form/hooks/useForm';
import Page from '../../page/Page';

/* -------------------------------------------------------------------------- */
/*                                    Types                                   */
/* -------------------------------------------------------------------------- */

export interface DetailPageStepsHeaderProps<TModel extends FieldValues = FieldValues>
  extends Omit<StepperProps, 'onChange'> {
  items: StepPane<TModel>[];
  status?: StepStatus;
}

export type StepPane<
  TModel extends FieldValues = FieldValues,
  TFieldStepName extends Path<TModel> = Path<TModel>,
> = Omit<StepProps & StepLabelProps, 'children' | 'key'> & {
  name?: TFieldStepName;
  key: React.Key;
  schema?: z.ZodType<PathValue<TModel, TFieldStepName>>;
  defaultValues?: DefaultValues<PathValue<TModel, TFieldStepName>>;
  label: ReactNode;
  children: ReactNode;
  validationOptions?: ValidationOptions;
};
export type StepStatus = 'wait' | 'process' | 'finish' | 'error';

/* -------------------------------------------------------------------------- */
/*                                   Styled                                   */
/* -------------------------------------------------------------------------- */

function DetailPageStepsHeader<TModel extends FieldValues = FieldValues>({
  activeStep = 0,
  items,
  ...stepperProps
}: DetailPageStepsHeaderProps<TModel>) {
  return (
    <>
      <Page.Content sx={{ py: 2 }}>
        <Stepper {...stepperProps} activeStep={activeStep}>
          {items.map(({ key, completed, disabled, expanded, icon, optional, label }) => (
            <Step key={key} completed={completed} disabled={disabled} expanded={expanded}>
              <StepLabel icon={icon} optional={optional}>
                {label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Page.Content>
    </>
  );
}

export default DetailPageStepsHeader;
