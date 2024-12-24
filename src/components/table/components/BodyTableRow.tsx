import { alpha } from '@mui/material';
import styled from '@mui/material/styles/styled';
import TableRow from '@mui/material/TableRow';

export const BodyTableRow = styled(TableRow, {
  shouldForwardProp: (prop) =>
    prop !== 'indicatorColor' && prop !== 'bordered' && prop !== 'bgColor',
})<{
  indicatorColor?: string;
  bgColor?: string;
  bordered?: boolean;
}>(({ bgColor, indicatorColor, theme, bordered = true }) => ({
  ...(indicatorColor && {
    '&:hover': {
      '&::after': { width: '7px' },
    },
    position: 'relative',
    '&::after': {
      top: 0,
      left: 0,
      width: '3px',
      content: '""',
      height: '100%',
      position: 'absolute',
      backgroundColor: indicatorColor,
      transition: 'all 0.2s',
    },
    '&+tr.description-row': {
      position: 'relative',
      '&::after': {
        top: 0,
        left: 0,
        width: '3px',
        content: '""',
        height: '100%',
        position: 'absolute',
        backgroundColor: indicatorColor,
      },
    },
  }),
  backgroundColor: bgColor,
  '& .MuiTableCell-root': {
    borderBottom: bordered ? undefined : 'none',
  },
  '&:hover:not(.description-row),&:hover+tr.description-row': {
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
  },
  '&:focus:not(.description-row),&:focus+tr.description-row': {
    backgroundColor: alpha(theme.palette.primary.main, 0.3),
  },
}));
