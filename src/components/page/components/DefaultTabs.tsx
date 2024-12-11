/* eslint-disable @typescript-eslint/no-unused-vars */
import { ReactNode } from 'react';

import { styled, Tab, TabProps, Tabs, TabsProps } from '@mui/material';

/* -------------------------------------------------------------------------- */
/*                                    Types                                   */
/* -------------------------------------------------------------------------- */
export type TabPane = Omit<TabProps, 'children' | 'key'> & { children?: ReactNode; key: string };

export interface DefaultTabsProps extends TabsProps {
  tabs: TabPane[];
  bordered?: boolean;
}

export type TabChangedPayload = { selectedTabIndex: number; selectedTabValue: string };

/* -------------------------------------------------------------------------- */
/*                                   Styled                                   */
/* -------------------------------------------------------------------------- */

const TabListWrapper = styled(Tabs)<{ bordered?: boolean }>(({ theme, bordered }) => ({
  borderBottom: bordered ? undefined : 0,
  [theme.breakpoints.down(727)]: { order: 3 },
}));

function DefaultTabs({ tabs, ...tabsProps }: DefaultTabsProps) {
  return (
    <TabListWrapper variant="scrollable" {...tabsProps}>
      {tabs.map(({ children, key, ...tabProps }) => (
        <Tab disableRipple iconPosition="start" key={key} {...tabProps} />
      ))}
    </TabListWrapper>
  );
}

export default DefaultTabs;
