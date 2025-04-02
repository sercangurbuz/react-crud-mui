import Box from '@mui/material/Box';
import styled from '@mui/material/styles/styled';

import Scrollbar from '../scrollbar';

export type ModalSize = 'normal' | 'small' | 'large';

export const modalSizes: Record<ModalSize, number | string> = {
  normal: 680,
  small: 400,
  large: 800,
};

export const Wrapper = styled(Box)<{ size?: ModalSize }>(({ theme, size = 'normal' }) => ({
  top: '50%',
  left: '50%',
  width: modalSizes[size],
  borderRadius: 16,
  overflow: 'hidden',
  position: 'absolute',
  transform: 'translate(-50%, -50%)',
  backgroundColor: theme.palette.background.paper,
  [theme.breakpoints.down(575)]: { maxWidth: '85dvw' },
}));

export const StyledScrollbar = styled(Scrollbar)({
  maxHeight: '65dvh',
});
