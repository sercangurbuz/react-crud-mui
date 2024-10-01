import { Info } from '@mui/icons-material';
import { Alert, AlertTitle, Button, Grid, Switch } from '@mui/material';
import { Meta, StoryObj } from '@storybook/react';

import { FlexBetween } from '../../components/flexbox';
import Add from '../../components/icons/Add';
import GroupSenior from '../../components/icons/GroupSenior';
import Page from '../../components/page/Page';
import { Paragraph, Small } from '../../components/typography';

const meta: Meta<typeof Page> = {
  title: 'Components/BasePage',
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
type BasePageStory = StoryObj<typeof Page>;

export const Simple: BasePageStory = {};

export const CommandsOnFooter: BasePageStory = {
  args: {
    commandsPosition: 'footer',
  },
};
