import Box from '@mui/material/Box';
import styled from '@mui/material/styles/styled';

import Scrollbar from '../scrollbar';

export const Wrapper = styled(Box)(({ theme }) => ({
  top: '50%',
  left: '50%',
  maxWidth: 680,
  width: '100%',
  borderRadius: 16,
  overflow: 'hidden',
  position: 'absolute',
  transform: 'translate(-50%, -50%)',
  backgroundColor: theme.palette.background.paper,
  [theme.breakpoints.down(575)]: { maxWidth: '85dvw' },
}));

export const StyledScrollbar = styled(Scrollbar)({
  maxHeight: '70dvh',
});
