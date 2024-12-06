import React, { PropsWithChildren, ReactNode } from 'react';
import { ControllerFieldState } from 'react-hook-form';

import { Box, BoxProps, FormHelperText } from '@mui/material';

import { FlexBox } from '../../flexbox';
import { Paragraph, Small } from '../../typography';

export interface FormControlProps {
  label?: ReactNode;
  helperText?: ReactNode;
  placement?: 'left' | 'right' | 'top' | 'bottom';
  labelProps?: BoxProps;
  wrapperProps?: React.ComponentProps<typeof FlexBox>;
}

function FormControl({
  placement = 'right',
  children,
  label,
  helperText,
  error,
  invalid,
  labelProps,
  wrapperProps,
}: PropsWithChildren<FormControlProps> & Partial<ControllerFieldState>) {
  /* -------------------------------------------------------------------------- */
  /*                               Render helpers                               */
  /* -------------------------------------------------------------------------- */

  const renderErrorMessage = () => {
    return error ? <FormHelperText error>{error.message}</FormHelperText> : null;
  };

  const renderControl = () => {
    const labelNode = (
      <Box key="label" {...labelProps}>
        <Paragraph fontWeight={500} lineHeight={1} color={invalid ? 'error.main' : 'text.primary'}>
          {label}
        </Paragraph>
        {helperText ? <Small color="text.secondary">{helperText}</Small> : null}
      </Box>
    );

    const nodes =
      placement === 'left' || placement === 'top' ? [children, labelNode] : [labelNode, children];

    return (
      <FlexBox
        alignItems={placement === 'left' || placement === 'right' ? 'center' : 'flex-start'}
        justifyContent={placement === 'right' ? 'space-between' : 'flex-start'}
        flexDirection={placement === 'left' || placement === 'right' ? 'row' : 'column'}
        gap={1}
        {...wrapperProps}
      >
        {nodes}
      </FlexBox>
    );
  };

  return (
    <Box>
      {renderControl()}
      {renderErrorMessage()}
    </Box>
  );
}

export default FormControl;
