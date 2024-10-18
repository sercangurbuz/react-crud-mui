import React, { PropsWithChildren } from 'react';

import { BoxProps } from '@mui/material';

import { FlexBox } from '../../flexbox';
import { Small } from '../../typography';

export interface EmptyTextProps extends BoxProps {
  emptyText: React.ReactNode;
  showEmptyImage?: boolean;
}

function EmptyText({
  emptyText,
  showEmptyImage = true,
  children,
  ...boxProps
}: PropsWithChildren<EmptyTextProps>) {
  /* -------------------------------------------------------------------------- */
  /*                                   Render                                   */
  /* -------------------------------------------------------------------------- */
  return (
    <FlexBox
      justifyContent="center"
      flexDirection="column"
      alignItems="center"
      gap={2}
      {...(boxProps as React.ComponentProps<typeof FlexBox>)}
    >
      {showEmptyImage && (
        <img src="/general-no-results-found.svg" width={150} height={150} alt="no record" />
      )}
      <FlexBox alignItems="center" flexDirection="column" gap={1}>
        <Small sx={{ color: 'text.disabled' }}>{emptyText}</Small>
        <Small color="primary.main">{children}</Small>
      </FlexBox>
    </FlexBox>
  );
}

export default EmptyText;
