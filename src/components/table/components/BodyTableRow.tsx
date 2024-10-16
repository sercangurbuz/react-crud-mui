import styled from '@mui/material/styles/styled';
import TableRow from '@mui/material/TableRow';

type Select = { selected_row: number };

export const BodyTableRow = styled(TableRow, {
  shouldForwardProp: (prop) => prop !== 'selected_row',
})<Select>(({ theme, selected_row }) => ({
  ...(selected_row && {
    position: 'relative',
    backgroundColor: theme.palette.action.selected,
    '&::after': {
      top: 0,
      left: 0,
      width: '3px',
      content: '""',
      height: '100%',
      position: 'absolute',
      backgroundColor: theme.palette.primary.main,
    },
  }),
}));
