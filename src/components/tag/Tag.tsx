import { PropsWithChildren } from 'react';

import { BoxProps } from '@mui/material/Box';

// STYLED COMPONENT
import { StyledSpan } from './styles';

export type Type = 'primary' | 'success' | 'error';

// ==============================================================
export interface TagProps extends PropsWithChildren, BoxProps {
  type?: Type;
  ellipsis?: boolean;
}
// ==============================================================

export default function Tag({ children, type = 'success', ellipsis = false, ...props }: TagProps) {
  return (
    <StyledSpan ellipsis={ellipsis} type={type} {...props}>
      {children}
    </StyledSpan>
  );
}
