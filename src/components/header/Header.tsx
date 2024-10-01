import React, { ReactNode } from 'react';

import { Box, BoxProps, Stack } from '@mui/material';

import { FlexBetween, FlexBox } from '../flexbox';
import IconWrapper from '../icon-wrapper';
import MoreButton, { MoreButtonProps } from '../more-button/MoreButton';
import { H6, Small } from '../typography';

export interface HeaderProps extends React.ComponentProps<typeof FlexBetween> {
  rightContent?: ReactNode;
  centerContent?: ReactNode;
  helperText?: ReactNode;
  header?: ReactNode;
  headerProps?: BoxProps;
  icon?: ReactNode;
  moreOptions?: MoreButtonProps['options'];
}

function Header({
  moreOptions,
  header,
  headerProps,
  icon,
  rightContent,
  helperText,
  centerContent,
  ...flexProps
}: HeaderProps) {
  return (
    <FlexBetween flexWrap="wrap" px={3} pt={3} {...flexProps}>
      <Box>
        <FlexBox alignItems="center">
          {icon ? <IconWrapper>{icon}</IconWrapper> : null}
          <Box fontSize={14} component={H6} {...headerProps}>
            {header}
          </Box>
        </FlexBox>
        <Small color="text.secondary">{helperText}</Small>
      </Box>
      {centerContent}
      <Stack direction="row" alignItems="center" gap={2}>
        {rightContent}
        {moreOptions?.length ? <MoreButton options={moreOptions} /> : null}
      </Stack>
    </FlexBetween>
  );
}

export default Header;
