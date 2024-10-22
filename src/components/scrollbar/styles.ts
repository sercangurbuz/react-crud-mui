import styled from '@mui/material/styles/styled';
import { alpha } from '@mui/system/colorManipulator';
import SimpleBar from 'simplebar-react';

import { isDark } from '../theme/theme.constants';

export const StyledScrollBar = styled(SimpleBar)(({ theme }) => ({
  maxHeight: '100%',
  '& .simplebar-scrollbar': {
    '&.simplebar-visible:before': { opacity: 1 },
    '&:before': {
      backgroundColor: alpha(theme.palette.grey[isDark(theme) ? 700 : 300], 0.6),
    },
  },
  '& .simplebar-mask': { zIndex: 'inherit' },
}));
