import Card from '@mui/material/Card';
import styled from '@mui/material/styles/styled';

export const StyledCard = styled(Card, {
  shouldForwardProp: (prop) => prop !== 'selected' && prop !== 'disabled',
})<{ selected?: boolean; disabled?: boolean }>(({ theme, selected, disabled }) => ({
  padding: '1rem',
  display: 'flex',
  cursor: 'pointer',
  alignItems: 'center',
  justifyContent: 'space-between',
  border: `1px solid ${selected ? (disabled ? theme.palette.action.disabled : theme.palette.primary.main) : theme.palette.divider}`,

  '& .place': {
    gap: 8,
    marginBottom: 8,
    display: 'flex',
    alignItems: 'center',
    color: selected
      ? disabled
        ? theme.palette.action.disabled
        : theme.palette.primary.main
      : theme.palette.text.secondary,
  },

  '& .check-mark': {
    padding: '.5rem',
    color: disabled ? theme.palette.action.disabled : theme.palette.primary.main,
  },
}));
