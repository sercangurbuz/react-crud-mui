import { Delete } from '@mui/icons-material';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import { Button, FormControlLabel, Grid, Switch, Tab } from '@mui/material';
import { Meta, StoryObj } from '@storybook/react';

import { FlexBetween } from '../../components/flexbox';
import Add from '../../components/icons/Add';
import Edit from '../../components/icons/Edit';
import GroupSenior from '../../components/icons/GroupSenior';
import Panel from '../../components/panel/Panel';
import { Paragraph, Small } from '../../components/typography';

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
    p: 3,
    bordered: false,
  },
};

export const WithMoreOptions: PanelStory = {
  args: {
    moreOptions: [
      { key: 'edit', children: 'Edit row', icon: <Edit fontSize="small" /> },
      { key: 'add', children: 'Add new row', icon: <Add fontSize="small" /> },
      { key: 'delete', children: 'Delete', icon: <Delete fontSize="small" />, danger: true },
    ],
  },
};

export const WithCustomHeader: PanelStory = {
  args: {
    icon: <GroupSenior sx={{ color: 'primary.main' }} />,
    headerProps: {
      fontSize: 16,
      fontWeight: 400,
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