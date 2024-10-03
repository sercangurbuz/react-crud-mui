import { PropsWithChildren } from 'react';

import { Stack } from '@mui/material';

import Tag from './Tag';

function Tags({ children }: PropsWithChildren) {
  return (
    <Stack direction="row" gap={1}>
      {children}
    </Stack>
  );
}

export default Tags;

Tags.Item = Tag;
