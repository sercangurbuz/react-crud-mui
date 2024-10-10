import { PropsWithChildren, ReactNode } from 'react';
import { ControllerFieldState } from 'react-hook-form';

import { Box, FormHelperText } from '@mui/material';

import { FlexBox } from '../../flexbox';
import { Paragraph, Small } from '../../typography';

export interface FormControlProps {
  label?: ReactNode;
  helperText?: ReactNode;
  placement?: 'left' | 'right' | 'top' | 'bottom';
}

function FormControl({
  placement = 'right',
  children,
  label,
  helperText,
  error,
  invalid,
}: PropsWithChildren<FormControlProps> & ControllerFieldState) {
  /* -------------------------------------------------------------------------- */
  /*                               Render helpers                               */
  /* -------------------------------------------------------------------------- */

  const renderErrorMessage = () => {
    return error ? <FormHelperText error>{error.message}</FormHelperText> : null;
  };

  const renderControl = () => {
    const labelNode = (
      <div key="label">
        <Paragraph fontWeight={500} lineHeight={1} color={invalid ? 'error.main' : 'text.primary'}>
          {label}
        </Paragraph>
        {helperText ? <Small color="text.secondary">{helperText}</Small> : null}
      </div>
    );

    const nodes =
      placement === 'left' || placement === 'top' ? [children, labelNode] : [labelNode, children];

    return (
      <FlexBox
        alignItems={placement === 'left' || placement === 'right' ? 'center' : 'flex-start'}
        justifyContent={placement === 'right' ? 'space-between' : 'flex-start'}
        flexDirection={placement === 'left' || placement === 'right' ? 'row' : 'column'}
        gap={1}
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
