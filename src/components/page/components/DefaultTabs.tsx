/* eslint-disable @typescript-eslint/no-unused-vars */
import { ReactNode } from 'react';

import { styled, SxProps } from '@mui/material/styles';
import Tab, { TabProps } from '@mui/material/Tab';
import Tabs, { TabsProps } from '@mui/material/Tabs';

import { FlexBox } from '../../flexbox';

/* -------------------------------------------------------------------------- */
/*                                    Types                                   */
/* -------------------------------------------------------------------------- */
export type TabPane = Omit<TabProps, 'children' | 'key'> & {
  children?: ReactNode;
  key: string;
  hidden?: boolean;
};

export interface DefaultTabsProps extends TabsProps {
  tabs: TabPane[];
  extra?: ReactNode;
  wrapperSx?: SxProps;
  hiddenOnSingleTab?: boolean;
}

export type TabChangedPayload = { selectedTabIndex: number; selectedTabValue: string };

/* -------------------------------------------------------------------------- */
/*                                   Styled                                   */
/* -------------------------------------------------------------------------- */

const TabListWrapper = styled(Tabs)(({ theme }) => ({
  borderBottom: 0,
  [theme.breakpoints.down(727)]: { order: 3 },
}));

function DefaultTabs({
  tabs,
  extra,
  wrapperSx,
  sx,
  hiddenOnSingleTab,
  ...tabsProps
}: DefaultTabsProps) {
  const filteredTabs = tabs
    .filter(({ hidden }) => hidden !== true)
    .map(({ children, key, hidden, ...tabProps }) => (
      <Tab disableRipple iconPosition="start" key={key} {...tabProps} />
    ));

  if (hiddenOnSingleTab && filteredTabs.length === 1) {
    return null;
  }

  return (
    <FlexBox sx={wrapperSx} alignItems="center">
      <TabListWrapper variant="scrollable" {...tabsProps} sx={{ flexGrow: 1, ...sx }}>
        {filteredTabs}
      </TabListWrapper>
      {extra}
    </FlexBox>
  );
}

export default DefaultTabs;
