import styled from '@mui/material/styles/styled';

import { isDark } from '../theme/theme.constants';
import { Span } from '../typography';
// CUSTOM DATA TYPE
import { Type } from './Tag';

//export const Span

// STYLED COMPONENT
export const StyledSpan = styled(Span, {
  shouldForwardProp: (prop) => prop !== 'type',
})<{ type: Type }>(({ theme, type }) => ({
  fontSize: 10,
  lineHeight: 1,
  fontWeight: 500,
  borderRadius: 16,
  padding: '.35rem .5rem',
  ...(type === 'primary' && {
    color: theme.palette.primary.main,
    backgroundColor: theme.palette.primary[25],
  }),
  ...(type === 'success' && {
    color: theme.palette.success[500],
    backgroundColor: theme.palette.success[50],
  }),
  ...(type === 'error' && {
    color: theme.palette.error.main,
    backgroundColor: theme.palette.error[50],
  }),

  ...(isDark(theme) && {
    backgroundColor: `${theme.palette.grey[700]} !important`,
  }),
}));
