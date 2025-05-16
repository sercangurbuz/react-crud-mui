import Box, { BoxProps } from '@mui/material/Box';

import usePage from '../hooks/usePage';
import { PagePadding } from '../Page';

function PageContent({ children, ...boxProps }: BoxProps) {
  const { size = 'normal' } = usePage();
  return (
    <Box p={PagePadding[size]} {...boxProps}>
      {children}
    </Box>
  );
}

export default PageContent;
