import { PropsWithChildren, ReactNode } from 'react';
import { ControllerFieldState } from 'react-hook-form';

import Box, { BoxProps } from '@mui/material/Box';
import FormHelperText from '@mui/material/FormHelperText';

import { FlexBox } from '../../flexbox';
import { FlexBoxProps } from '../../flexbox/FlexBox';
import { Paragraph, Small } from '../../typography';

export interface FormControlProps {
  label?: ReactNode | [ReactNode, ReactNode];
  helperText?: ReactNode;
  placement?: 'left' | 'right' | 'top' | 'bottom';
  labelProps?: BoxProps;
  wrapperProps?: FlexBoxProps;
  disabled?: boolean;
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
  disabled,
}: PropsWithChildren<FormControlProps> & Partial<ControllerFieldState>) {
  /* -------------------------------------------------------------------------- */
  /*                               Render helpers                               */
  /* -------------------------------------------------------------------------- */

  const renderErrorMessage = () => {
    return error ? <FormHelperText error>{error.message}</FormHelperText> : null;
  };

  const renderLabel = (labelNode: ReactNode) => {
    return (
      <Box key="label">
        <Paragraph
          fontWeight={500}
          lineHeight={1}
          color={disabled ? 'text.secondary' : invalid ? 'error.main' : 'text.primary'}
          {...labelProps}
        >
          {labelNode}
        </Paragraph>
        {helperText ? <Small color="text.secondary">{helperText}</Small> : null}
      </Box>
    );
  };

  const renderControl = () => {
    const nodes = Array.isArray(label)
      ? [renderLabel(label[0]), children, renderLabel(label[1])]
      : placement === 'left' || placement === 'bottom'
        ? [children, renderLabel(label)]
        : [renderLabel(label), children];

    return (
      <FlexBox
        alignItems={placement === 'left' || placement === 'right' ? 'center' : 'flex-start'}
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
