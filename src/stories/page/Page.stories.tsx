/* eslint-disable react/no-children-prop */
/* eslint-disable react-hooks/rules-of-hooks */
import { useState } from 'react';

import Assignment from '@mui/icons-material/Assignment';
import Done from '@mui/icons-material/Done';
import Pending from '@mui/icons-material/Pending';
import SettingsApplications from '@mui/icons-material/SettingsApplications';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import LinearProgress from '@mui/material/LinearProgress';
import Switch from '@mui/material/Switch';
import { Meta, StoryObj } from '@storybook/react';

import { FlexBetween, FlexBox } from '../../components/flexbox';
import Add from '../../components/icons/Add';
import GroupSenior from '../../components/icons/GroupSenior';
import Page from '../../components/page/Page';
import Table from '../../components/table/Table';
import { H5, Paragraph, Small, Tiny } from '../../components/typography';
import mockData from '../../test-setup/mockUsers.json';
import { columns } from '../table/Table.stories';

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
type PageModalStory = StoryObj<typeof Page.Modal>;

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
    bordered: false,
    tabsPosition: 'in-subrow',
  },
};

export const TabsExtraContent: PageStory = {
  args: {
    ...TabsInSubRow.args,
    tabExtraContent: <Chip size="small" label="Credit 500" />,
  },
};

export const HiddenTabsOnSingleTab: PageStory = {
  args: {
    ...TabsInSubRow.args,
    onTabs: (props) => (
      <Page.Tabs
        {...props}
        tabs={props.tabs.map((tab, index) => ({
          ...tab,
          hidden: index !== 0,
        }))}
        hiddenOnSingleTab
      />
    ),
  },
};

export const WithPanels: PageStory = {
  args: {
    children: null,
    panels: [
      {
        key: 'panel1',
        label: 'Assigned',
        defaultExpanded: true,
        footer: (
          <Paragraph fontWeight={500} color="text.secondary">
            2 of 3 tasks are completed
          </Paragraph>
        ),
        children: (
          <Page.Content paddingTop={0}>
            By Uko to save tons and more to time money projects are listed and outstanding.
          </Page.Content>
        ),
      },
      {
        key: 'panel2',
        label: 'Pending',
        defaultExpanded: true,
        children: (
          <Page.Content>
            The vows and named is he seven his origin myself any is decision-making. The interface
            of Jeni’s is simple and clean, with the section includes questions that are very
            specific to their customer group. First thing first, you need to sort out what explicit.
            The advice is to see mails and phone call data, then make a rundown of the top questions
            that show up continually.
          </Page.Content>
        ),
      },
      {
        key: 'panel3',
        label: 'Done',
        defaultExpanded: true,
        detailsProps: { sx: { p: 0 } },
        children: <Table data={mockData} columns={columns} />,
      },
    ],
  },
};

export const OpenInModal: PageStory = {
  args: {
    ...TabsInSubRow.args,
  },
  render: (args) => {
    const [visible, setVisible] = useState<boolean>(true);
    return (
      <>
        <Button onClick={() => setVisible(true)}>Toggle Page Modal</Button>
        <Page.Modal
          {...args}
          useHeaderIconWrapper={false}
          icon={<SettingsApplications />}
          commandsPosition="bottom-right"
          open={visible}
          onClose={() => setVisible(false)}
        />
      </>
    );
  },
};

export const SmallSizeModal: PageModalStory = {
  ...OpenInModal,
  args: {
    ...OpenInModal.args,
    modalProps: {
      size: 'small',
    },
  },
};

export const LargeSizeModal: PageModalStory = {
  ...OpenInModal,
  args: {
    ...OpenInModal.args,
    modalProps: {
      size: 'large',
    },
  },
};

export const CustomSizeModal: PageModalStory = {
  ...OpenInModal,
  args: {
    ...OpenInModal.args,
    modalProps: {
      sx: { width: '90dvw' },
    },
  },
};

export const OpenInModalWithLargeContent: PageStory = {
  args: {},
  render: (args) => {
    const [visible, setVisible] = useState<boolean>(true);
    return (
      <>
        <Button onClick={() => setVisible(true)}>Toggle Page Modal</Button>
        <Page.Modal
          {...args}
          children={
            <>
              {args.children}
              {args.children}
              {args.children}
              {args.children}
              {args.children}
            </>
          }
          commandsPosition="bottom-right"
          open={visible}
          onClose={() => setVisible(false)}
        />
      </>
    );
  },
};

export const OpenInDrawer: PageStory = {
  args: {},
  render: (args) => {
    const [visible, setVisible] = useState<boolean>(true);
    return (
      <>
        <Button onClick={() => setVisible(true)}>Toggle Page Modal</Button>
        <Page.Drawer
          {...args}
          commandsPosition="bottom-right"
          open={visible}
          onClose={() => setVisible(false)}
        />
      </>
    );
  },
};

export const OpenInDrawerWithLArgeContent: PageStory = {
  args: {},
  render: (args) => {
    const [visible, setVisible] = useState<boolean>(true);
    return (
      <>
        <Button onClick={() => setVisible(true)}>Toggle Page Modal</Button>
        <Page.Drawer
          {...args}
          loading
          children={
            <>
              {args.children}
              {args.children}
              {args.children}
              {args.children}
              {args.children}
            </>
          }
          open={visible}
          onClose={() => setVisible(false)}
        />
      </>
    );
  },
};
