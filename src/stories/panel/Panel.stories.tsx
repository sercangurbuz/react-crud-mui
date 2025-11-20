import { useState } from 'react';

import Delete from '@mui/icons-material/Delete';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import Switch from '@mui/material/Switch';
import Tab from '@mui/material/Tab';
import { Meta, StoryObj } from '@storybook/react';

import { FlexBetween } from '../../components/flexbox';
import Add from '../../components/icons/Add';
import Edit from '../../components/icons/Edit';
import GroupSenior from '../../components/icons/GroupSenior';
import Page from '../../components/page/Page';
import Panel from '../../components/panel/Panel';
import { H1, Paragraph, Small } from '../../components/typography';

const meta: Meta<typeof Panel> = {
  title: 'Components/Panel',
  component: Panel,
  args: {
    header: 'General Settings',
    children: (
      <Grid item sm={6} xs={12} padding={3}>
        <FlexBetween>
          <div>
            <Paragraph fontWeight={500}>Early release</Paragraph>
            <Small color="text.secondary">Get included on new features.</Small>
          </div>

          <Switch defaultChecked />
        </FlexBetween>

        <FlexBetween mt={2}>
          <div>
            <Paragraph fontWeight={500}>See info about people who view my profile</Paragraph>
            <Small color="text.secondary">More about viewer info.</Small>
          </div>

          <Switch defaultChecked />
        </FlexBetween>
      </Grid>
    ),
  },
};

export default meta;
type PanelStory = StoryObj<typeof Panel>;

export const Simple: PanelStory = {};

export const WithExtraContent: PanelStory = {
  args: {
    helperText: 'Extra settings of panel',
    rightContent: (
      <FormControlLabel
        label="Test Mode"
        control={<Switch defaultChecked />}
        slotProps={{ typography: { fontSize: 14 } }}
      />
    ),
  },
};

export const WithIcon: PanelStory = {
  args: {
    icon: <GroupSenior sx={{ color: 'primary.main' }} />,
  },
};

export const WithMoreOptions: PanelStory = {
  args: {
    moreOptions: [
      { key: 'edit', children: 'Edit row', icon: <Edit fontSize="small" /> },
      { key: 'add', children: 'Add new row', icon: <Add fontSize="small" /> },
      { key: 'divider', divider: true },
      { key: 'delete', children: 'Delete', icon: <Delete fontSize="small" />, danger: true },
    ],
  },
};

export const WithTabs: PanelStory = {
  args: {
    ...WithMoreOptions.args,
    tabs: [
      {
        key: 'tab1',
        value: 'debt-list',
        title: (
          <Paragraph ellipsis lineHeight={1} fontWeight={500} color="text.secondary">
            Debt list
          </Paragraph>
        ),
        children: (
          <Page.Content>
            <H1>Tab1 content</H1>
          </Page.Content>
        ),
      },
      {
        key: 'tab2',
        value: 'account-statement',
        title: (
          <Paragraph ellipsis lineHeight={1} fontWeight={500} color="text.secondary">
            Account Statement
          </Paragraph>
        ),
        children: (
          <Page.Content>
            <H1>Account Statement</H1>
          </Page.Content>
        ),
      },
    ],
  },
};

export const ControlledTabs: PanelStory = {
  args: {
    sx: { border: '1px solid', borderColor: 'divider' },
    ...WithTabs.args,
    activeTabKey: 'account-statement',
  },
  render: (args) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [activeTab, setActiveTab] = useState(args.activeTabKey);

    return (
      <Panel
        {...args}
        activeTabKey={activeTab}
        onTabChange={(key) => {
          setActiveTab(key);
        }}
      />
    );
  },
};

export const WithCustomHeader: PanelStory = {
  args: {
    icon: <GroupSenior sx={{ color: 'primary.main' }} />,
    styles: {
      title: { fontSize: 16, fontWeight: 400 },
    },
  },
};

export const WithCenterContent: PanelStory = {
  args: {
    icon: <GroupSenior sx={{ color: 'primary.main' }} />,
    rightContent: (
      <Button variant="contained" startIcon={<Add />}>
        Add New User
      </Button>
    ),
    centerContent: (
      <TabContext value="">
        <TabList
          variant="scrollable"
          sx={{
            borderBottom: 0,
          }}
        >
          <Tab disableRipple label="All Users" value="" />
          <Tab disableRipple label="Editor" value="editor" />
          <Tab disableRipple label="Contributor" value="contributor" />
          <Tab disableRipple label="Administrator" value="administrator" />
          <Tab disableRipple label="Subscriber" value="subscriber" />
        </TabList>
      </TabContext>
    ),
  },
};
