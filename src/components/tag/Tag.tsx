import { PropsWithChildren } from 'react';

import { BoxProps } from '@mui/material/Box';

// STYLED COMPONENT
import { StyledPercentage, StyledStatus, StyledTag } from './styles';

export type Type = 'success' | 'primary' | 'error' | 'warning';

// ==============================================================
export interface TagProps extends PropsWithChildren, BoxProps {
  type?: Type;
  ellipsis?: boolean;
  variant?: 'status' | 'tag' | 'percentage';
}
// ==============================================================

export default function Tag({
  children,
  variant = 'tag',
  type = 'success',
  ellipsis = false,
  ...props
}: TagProps) {
  return variant === 'tag' ? (
    <StyledTag ellipsis={ellipsis} type={type} {...props}>
      {children}
    </StyledTag>
  ) : variant === 'percentage' ? (
    <StyledPercentage ellipsis={ellipsis} type={type} {...props}>
      {children}
    </StyledPercentage>
  ) : (
    <StyledStatus ellipsis={ellipsis} type={type} {...props}>
      {children}
    </StyledStatus>
  );
}
