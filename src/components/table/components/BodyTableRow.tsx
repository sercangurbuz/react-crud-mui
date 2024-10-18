import styled from '@mui/material/styles/styled';
import TableRow from '@mui/material/TableRow';

import { isDark } from '../../theme/theme.constants';

//type Select = { selected_row: number };
/* 
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
})); */

export const BodyTableRow = styled(TableRow, {
  shouldForwardProp: (prop) => prop !== 'isSelected' && prop !== 'bordered',
})<{
  isSelected?: boolean;
  bordered?: boolean;
}>(({ isSelected, theme, bordered = true }) => ({
  ...(isSelected && {
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
  '& .MuiTableCell-root': {
    borderBottom: bordered ? undefined : 'none',
  },
  '&:hover:not(.description-row),&:hover+tr.description-row': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:focus:not(.description-row),&:focus+tr.description-row': {
    backgroundColor: isDark(theme) ? theme.palette.primary[900] : theme.palette.primary[700],
  },
}));
