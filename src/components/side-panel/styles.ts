import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';

export const StyledButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'active' && prop !== 'danger' && prop !== 'disabled',
})<{ active: boolean; danger?: boolean; disabled?: boolean }>(
  ({ theme, active, danger, disabled }) => ({
    borderRadius: 0,
    fontWeight: 500,
    position: 'relative',
    padding: '0.6rem 1.5rem',
    justifyContent: 'flex-start',
    color: danger ? theme.palette.error.main : theme.palette.grey[500],
    ...(active && {
      color: danger ? theme.palette.error.main : theme.palette.primary.main,
      backgroundColor: theme.palette.action.selected,
      '&:hover': { backgroundColor: theme.palette.action.hover },
      '&::before': {
        left: 0,
        width: 4,
        content: '""',
        height: '100%',
        borderRadius: 4,
        position: 'absolute',
        transition: 'all 0.3s',
        backgroundColor: danger ? theme.palette.error.main : theme.palette.primary.main,
      },
    }),

    '&:hover': {
      color: danger ? theme.palette.error.main : theme.palette.primary.main,
      backgroundColor: theme.palette.action.selected,
      '&:hover': { backgroundColor: theme.palette.action.hover },
      '&::before': {
        left: 0,
        width: 4,
        content: '""',
        height: '100%',
        borderRadius: 4,
        position: 'absolute',
        transition: 'all 0.3s',
        backgroundColor: danger ? theme.palette.error.main : theme.palette.primary.main,
      },
    },
    ...(disabled && {
      color: theme.palette.action.disabled,
      backgroundColor: theme.palette.action.disabledBackground,
      pointerEvents: 'none',
      cursor: 'not-allowed',
    }),
  }),
);
