import Card from '@mui/material/Card';
import styled from '@mui/material/styles/styled';

export const StyledCard = styled(Card, {
  shouldForwardProp: (prop) => prop !== 'selected' && prop !== 'disabled',
})<{ selected?: boolean; disabled?: boolean }>(({ theme, selected, disabled }) => ({
  padding: '1em',
  cursor: 'pointer',
  border: `1px solid ${selected ? (disabled ? theme.palette.action.disabled : theme.palette.primary.main) : theme.palette.divider}`,

  '& .place': {
    gap: '.5em',
    marginBottom: '.4em',
    display: 'flex',
    alignItems: 'center',
    color: selected
      ? disabled
        ? theme.palette.action.disabled
        : theme.palette.primary.main
      : theme.palette.text.secondary,

    '& .panel-label': {
      fontSize: '.98em',
    },
  },

  '& .panel-helper-label': {
    fontSize: '.85em',
  },

  '& .check-mark': {
    padding: '.5rem',
    color: disabled ? theme.palette.action.disabled : theme.palette.primary.main,
  },
}));
