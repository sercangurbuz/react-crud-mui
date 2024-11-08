import React, { PropsWithChildren } from 'react';

import { BoxProps } from '@mui/material';

import { FlexBox } from '../../flexbox';
import { Small } from '../../typography';
import DEFAULT_EMPTY_IMAGE from './general-no-results-found.svg';

export interface EmptyTextProps extends BoxProps {
  emptyText: React.ReactNode;
  showEmptyImage?: boolean;
  emptyImageUrl?: string;
}

function EmptyText({
  emptyText,
  showEmptyImage = true,
  children,
  emptyImageUrl = DEFAULT_EMPTY_IMAGE,
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
      {showEmptyImage && <img src={emptyImageUrl} width={150} height={150} alt="no record" />}
      <FlexBox alignItems="center" flexDirection="column" gap={1}>
        <Small sx={{ color: 'text.secondary' }}>{emptyText}</Small>
        <Small color="primary.main">{children}</Small>
      </FlexBox>
    </FlexBox>
  );
}

export default EmptyText;
