import { PropsWithChildren } from 'react';

import { SxProps } from '@mui/system/styleFunctionSx';
import { Props } from 'simplebar-react';

import { StyledScrollBar } from './styles';

export interface ScrollbarProps extends PropsWithChildren<Props> {
  sx?: SxProps;
}

export default StyledScrollBar;
