import styled from '@mui/material/styles/styled';
import TableCell from '@mui/material/TableCell';

export const BodyTableCell = styled(TableCell, {
  shouldForwardProp: (prop) => prop !== 'ellipsis',
})<{ ellipsis?: boolean }>(({ theme, ellipsis }) => ({
  padding: '1rem',
  borderBottom: `1px solid ${theme.palette.divider}`,
  ':first-of-type': { paddingLeft: 16 },
  ...(ellipsis && {
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    wordBreak: 'keep-all',
    overflowWrap: 'break-word',
  }),
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
