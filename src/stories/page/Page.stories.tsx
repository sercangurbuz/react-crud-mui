import { Assignment, Done, Pending } from '@mui/icons-material';
import { Box, Button, LinearProgress, Switch } from '@mui/material';
import { Meta, StoryObj } from '@storybook/react';

import { FlexBetween, FlexBox } from '../../components/flexbox';
import Add from '../../components/icons/Add';
import GroupSenior from '../../components/icons/GroupSenior';
import Page from '../../components/page/Page';
import { H5, Paragraph, Small, Tiny } from '../../components/typography';

const meta: Meta<typeof Page> = {
  title: 'Components/Page',
  component: Page,
  args: {
    header: 'General Settings',
    icon: <GroupSenior sx={{ color: 'primary.main' }} />,
    commandsContent: (
      <Button variant="contained" startIcon={<Add />}>
        Add New User
      </Button>
    ),
    children: (
      <>
        <Page.Content>
          <FlexBetween>
            <div>
              <Paragraph fontWeight={500}>Early release</Paragraph>
              <Small color="text.secondary">Get included on new features.</Small>
            </div>

            <Switch defaultChecked />
          </FlexBetween>
        </Page.Content>
        <Page.Divider />
        <Page.Content>
          <FlexBetween mt={2}>
            <div>
              <Paragraph fontWeight={500}>See info about people who view my profile</Paragraph>
              <Small color="text.secondary">More about viewer info.</Small>
            </div>

            <Switch defaultChecked />
          </FlexBetween>
        </Page.Content>
      </>
    ),
  },
};

export default meta;
type PageStory = StoryObj<typeof Page>;

export const Simple: PageStory = {};

export const RightContent: PageStory = {
  args: {
    rightContent: <Paragraph>This is right content</Paragraph>,
  },
};

export const Bordered: PageStory = {
  args: {
    bordered: true,
  },
};

export const CommandsOnFooter: PageStory = {
  args: {
    commandsPosition: 'bottom-right',
  },
};

export const NoCommands: PageStory = {
  args: {
    showCommands: false,
  },
};

export const WithMoreContent: PageStory = {
  args: {
    morePanelProps: {
      extraContent: (
        <Box minWidth={200} ml={1}>
          <Tiny color="text.secondary" mb={0.5}>
            Profil tamamlanma oranı
          </Tiny>
          <FlexBox alignItems="center">
            <LinearProgress
              value={60}
              color="success"
              variant="determinate"
              sx={{ flexGrow: 1, mr: 1 }}
            />
            <Tiny fontWeight={600} color="text.secondary">
              {`${60}%`}
            </Tiny>
          </FlexBox>
        </Box>
      ),
    },
    moreContent: (
      <>
        <Page.Divider />
        <Page.Content>
          <H5>This is more content</H5>
        </Page.Content>
      </>
    ),
  },
};

export const WithFooter: PageStory = {
  args: {
    commandsPosition: 'bottom-right',
    footerContent: 'Extra footer within the same level with commands',
  },
};

export const WithTabs: PageStory = {
  args: {
    selectedTabIndex: 0,
    tabs: [
      {
        key: 'tab1',
        value: 'assigned',
        label: 'Assigned',
        icon: <Assignment />,
      },
      {
        key: 'tab2',
        value: 'pending',
        label: 'Pending',
        icon: <Pending />,
      },
      {
        key: 'tab3',
        value: 'done',
        label: 'Done',
        icon: <Done />,
      },
    ],
  },
};

export const TabsInSubRow: PageStory = {
  args: {
    ...WithTabs.args,
    tabsPosition: 'in-subrow',
  },
};
