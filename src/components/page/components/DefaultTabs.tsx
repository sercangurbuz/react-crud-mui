/* eslint-disable @typescript-eslint/no-unused-vars */
import { ReactNode } from 'react';

import { styled, SxProps, Tab, TabProps, Tabs, TabsProps } from '@mui/material';

import { FlexBox } from '../../flexbox';

/* -------------------------------------------------------------------------- */
/*                                    Types                                   */
/* -------------------------------------------------------------------------- */
export type TabPane = Omit<TabProps, 'children' | 'key'> & { children?: ReactNode; key: string };

export interface DefaultTabsProps extends TabsProps {
  tabs: TabPane[];
  bordered?: boolean;
  extra?: ReactNode;
  wrapperSx?: SxProps;
}

export type TabChangedPayload = { selectedTabIndex: number; selectedTabValue: string };

/* -------------------------------------------------------------------------- */
/*                                   Styled                                   */
/* -------------------------------------------------------------------------- */

const TabListWrapper = styled(Tabs)<{ bordered?: boolean }>(({ theme, bordered }) => ({
  borderBottom: bordered ? undefined : 0,
  [theme.breakpoints.down(727)]: { order: 3 },
}));

function DefaultTabs({ tabs, extra, wrapperSx, sx, ...tabsProps }: DefaultTabsProps) {
  return (
    <FlexBox sx={wrapperSx} alignItems="center">
      <TabListWrapper variant="scrollable" {...tabsProps} sx={{ flexGrow: 1, ...sx }}>
        {tabs.map(({ children, key, ...tabProps }) => (
          <Tab disableRipple iconPosition="start" key={key} {...tabProps} />
        ))}
      </TabListWrapper>
      {extra}
    </FlexBox>
  );
}

export default DefaultTabs;
