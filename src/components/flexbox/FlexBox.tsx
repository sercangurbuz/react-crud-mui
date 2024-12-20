import { forwardRef } from 'react';

import Box, { BoxProps } from '@mui/material/Box';

export type FlexBoxProps = React.ComponentProps<typeof FlexBox>;

const FlexBox = forwardRef<HTMLDivElement, BoxProps>(({ children, ...props }, ref) => (
  <Box display="flex" ref={ref} {...props}>
    {children}
  </Box>
));

export default FlexBox;
