import styled from '@mui/material/styles/styled';

import { BodyTableCell } from './BodyTableCell';

export const HeadTableCell = styled(BodyTableCell)({
  ':last-of-type': { paddingRight: 16 },
});
