import { ReactNode } from 'react';

import { styled, Tab, TabProps, Tabs, TabsProps } from '@mui/material';

/* -------------------------------------------------------------------------- */
/*                                    Types                                   */
/* -------------------------------------------------------------------------- */
export type TabPane = Omit<TabProps, 'children'> & { children?: ReactNode };

export interface DefaultTabsProps extends TabsProps {
  tabs: TabPane[];
}

/* -------------------------------------------------------------------------- */
/*                                   Styled                                   */
/* -------------------------------------------------------------------------- */

const TabListWrapper = styled(Tabs)(({ theme }) => ({
  borderBottom: 0,
  [theme.breakpoints.down(727)]: { order: 3 },
}));

function DefaultTabs({ tabs, ...tabsProps }: DefaultTabsProps) {
  return (
    <TabListWrapper variant="scrollable" {...tabsProps}>
      {tabs.map(({ children, ...tabProps }) => (
        <Tab disableRipple iconPosition="start" {...tabProps} />
      ))}
    </TabListWrapper>
  );
}

export default DefaultTabs;
