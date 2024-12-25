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
  useIconWrapper?: boolean;
}

function Header({
  centerContent,
  children,
  header,
  headerProps,
  helperText,
  icon,
  moreOptions,
  rightContent,
  useIconWrapper = true,
  ...flexProps
}: HeaderProps) {
  return (
    <>
      <FlexBetween flexWrap="wrap" p={3} gap={1} {...flexProps}>
        <Box>
          <FlexBox alignItems="center">
            {icon ? useIconWrapper ? <IconWrapper>{icon}</IconWrapper> : icon : null}
            <FlexBox flexDirection="column">
              {header ? (
                <Box fontSize={16} fontWeight={600} component={H6} {...headerProps}>
                  {header}
                </Box>
              ) : null}
              {helperText ? <Small color="text.secondary">{helperText}</Small> : null}
            </FlexBox>
          </FlexBox>
        </Box>
        {centerContent}
        <Stack direction="row" alignItems="center" gap={2}>
          {rightContent}
          {moreOptions?.length ? <MoreButton options={moreOptions} /> : null}
        </Stack>
      </FlexBetween>
      {children}
    </>
  );
}

export default Header;
