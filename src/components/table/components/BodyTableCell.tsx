import styled from '@mui/material/styles/styled';
import TableCell from '@mui/material/TableCell';

export const BodyTableCell = styled(TableCell)(({ theme }) => ({
  padding: '1rem',
  borderBottom: `1px solid ${theme.palette.divider}`,
  ':first-of-type': { paddingLeft: 16 },
  variants: [
    {
      props({ size }) {
        return size === 'small';
      },
      style: {
        padding: '0.5rem',
      },
    },
  ],
}));
