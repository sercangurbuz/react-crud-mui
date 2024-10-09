import { PropsWithChildren, ReactNode } from 'react';

import { FlexBox } from '../../flexbox';
import { Paragraph, Small } from '../../typography';

export interface FormControlProps {
  label?: ReactNode;
  helperText?: ReactNode;
  placement?: 'left' | 'right';
}

function FormControl({
  placement = 'right',
  children,
  label,
  helperText,
}: PropsWithChildren<FormControlProps>) {
  /* -------------------------------------------------------------------------- */
  /*                               Render helpers                               */
  /* -------------------------------------------------------------------------- */

  const labelNode = (
    <div key="label">
      <Paragraph fontWeight={500} lineHeight={1}>
        {label}
      </Paragraph>
      {helperText ? <Small color="text.secondary">{helperText}</Small> : null}
    </div>
  );

  const nodes = placement === 'left' ? [children, labelNode] : [labelNode, children];

  return (
    <FlexBox
      alignItems="center"
      justifyContent={placement === 'right' ? 'space-between' : 'flex-start'}
      flexDirection="row"
      gap={1}
    >
      {nodes}
    </FlexBox>
  );
}

export default FormControl;
