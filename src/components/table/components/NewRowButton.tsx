import { ButtonBase, styled } from '@mui/material';

export const NewRowButton = styled(ButtonBase)(({ theme }) => ({
  padding: 5,
  paddingRight: '15px',
  textAlign: 'left',
  borderRadius: 30,
  border: `1px solid ${theme.palette.divider}`,
  '&:hover': { backgroundColor: theme.palette.action.hover },
  '&:active': { backgroundColor: theme.palette.action.selected },
}));
