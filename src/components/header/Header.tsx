import React, { ReactNode } from 'react';

import Box, { BoxProps } from '@mui/material/Box';
import Stack from '@mui/material/Stack';

import { FlexBetween, FlexBox } from '../flexbox';
import { FlexBoxProps } from '../flexbox/FlexBox';
import IconWrapper from '../icon-wrapper';
import MoreButton, { MoreButtonProps } from '../more-button/MoreButton';
import { H6, Small } from '../typography';

export interface HeaderOwnProps {
  rightContent?: ReactNode;
  centerContent?: ReactNode;
  helperText?: ReactNode;
  header?: ReactNode;
  icon?: ReactNode;
  moreOptions?: MoreButtonProps['options'];
  useHeaderIconWrapper?: boolean;
  styles?: {
    wrapper?: FlexBoxProps['sx'];
    icon?: BoxProps['sx'];
    title?: BoxProps['sx'];
    helperText?: BoxProps['sx'];
  };
}

export type HeaderProps = HeaderOwnProps & React.ComponentProps<typeof FlexBetween>;

function Header({
  centerContent,
  children,
  header,
  helperText,
  icon,
  moreOptions,
  rightContent,
  useHeaderIconWrapper = true,
  styles,
  ...flexProps
}: HeaderProps) {
  return (
    <>
      <FlexBetween flexWrap="wrap" p={2} gap={1} sx={styles?.wrapper} {...flexProps}>
        <Box>
          <FlexBox alignItems="center" gap={1}>
            {icon ? (
              useHeaderIconWrapper ? (
                <IconWrapper sx={styles?.icon}>{icon}</IconWrapper>
              ) : (
                icon
              )
            ) : null}
            <FlexBox flexDirection="column">
              {header ? (
                <Box fontSize={16} fontWeight={600} component={H6} sx={styles?.title}>
                  {header}
                </Box>
              ) : null}
              {helperText ? (
                <Small color="text.secondary" sx={styles?.helperText}>
                  {helperText}
                </Small>
              ) : null}
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
