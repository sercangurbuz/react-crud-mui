import { alpha } from '@mui/material/styles';
import styled from '@mui/material/styles/styled';

import { isDark } from '../theme/theme.constants';
import { Paragraph, Span } from '../typography';
import { Type } from './Tag';

export const StyledTag = styled(Span, {
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

export const StyledStatus = styled(Paragraph, {
  shouldForwardProp: (prop) => prop !== 'type' && prop !== 'ellipsis',
})<{ type: Type }>(({ theme, type }) => ({
  borderRadius: 6,
  padding: '.2rem .7rem',
  display: 'inline-block',
  ...(type === 'warning' && {
    color: theme.palette.warning[600],
    backgroundColor: theme.palette.warning[100],
  }),
  ...(type === 'success' && {
    color: theme.palette.success[600],
    backgroundColor: theme.palette.success[50],
  }),
  ...(type === 'primary' && {
    color: theme.palette.primary[500],
    backgroundColor: theme.palette.primary[50],
  }),
  ...(type === 'error' && {
    color: theme.palette.error[500],
    backgroundColor: theme.palette.error[50],
  }),

  ...theme.applyStyles('dark', {
    backgroundColor: `${theme.palette.grey[700]} !important`,
  }),
}));

export const StyledPercentage = styled(Span, {
  shouldForwardProp: (prop) => prop !== 'type',
})<{ type: Type }>(({ theme, type }) => ({
  fontSize: 12,
  lineHeight: 1,
  fontWeight: 500,
  borderRadius: 12,
  padding: '.25rem .4rem',
  ...(type === 'primary' && {
    color: theme.palette.primary.main,
    backgroundColor: theme.palette.primary[25],
    ...theme.applyStyles('dark', { backgroundColor: alpha(theme.palette.primary.main, 0.2) }),
  }),
  ...(type === 'success' && {
    color: theme.palette.success[500],
    backgroundColor: theme.palette.success[50],
    ...theme.applyStyles('dark', { backgroundColor: alpha(theme.palette.success.main, 0.2) }),
  }),
  ...(type === 'error' && {
    color: theme.palette.error.main,
    backgroundColor: theme.palette.error[50],
    ...theme.applyStyles('dark', { backgroundColor: alpha(theme.palette.error.main, 0.2) }),
  }),
}));
