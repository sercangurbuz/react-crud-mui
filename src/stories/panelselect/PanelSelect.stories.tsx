import { Settings } from '@mui/icons-material';
import { Box, IconButton, LinearProgress, Switch } from '@mui/material';
import { Meta, StoryObj } from '@storybook/react';
import { z } from 'zod';

import { FlexBetween, FlexBox, H5, Paragraph, Small as SmallText, Tiny } from '../..';
import DetailPage from '../../components/detail-page';
import Field from '../../components/form/Field';
import City from '../../components/icons/City';
import Page from '../../components/page/Page';

const meta: Meta<typeof Field.PanelSelect> = {
  title: 'Components/PanelSelect',
  args: {
    data: [
      {
        icon: <City />,
        label: 'John Doe',
        helperText: '123 Elm Street, 10001 New York',
        value: '1',
      },
      {
        icon: <City />,
        disabled: true,
        label: 'Jane Smith',
        helperText: '456 Baker Street, SW1A 1AA London (Disabled)',
        value: '2',
        selectedIcon: (
          <IconButton>
            <Settings sx={{ color: 'primary.main' }} />
          </IconButton>
        ),
      },
      {
        icon: <City />,
        label: 'Akira Tanaka',
        helperText: '789 Sakura Avenue, 100-0001 Tokyo',
        value: '3',
        deleteable: true,
      },
    ],
    name: 'addressId',
  },
  component: Field.PanelSelect,
  decorators: (Story) => {
    return (
      <DetailPage
        schema={z.object({
          addressId: z.string().nullable(),
        })}
        validationOptions={{ callOutVisibility: 'all' }}
        defaultValues={{ addressId: '1' }}
        showHeader={false}
      >
        <Page.Content>
          <Box sx={{ width: 500, mb: 5 }}>
            <Story />
          </Box>
          <Field.Button
            onClick={(form) => form.setValue('addressId', null, { shouldValidate: true })}
          >
            Reset
          </Field.Button>
        </Page.Content>
        <Page.Divider />
        <Page.Content>
          <Field.Watch name="addressId" label="Selected Address Id" sx={{ marginTop: 3 }} />
        </Page.Content>
      </DetailPage>
    );
  },
};

export default meta;
type PanelSelectStory = StoryObj<typeof Field.PanelSelect>;

export const Simple: PanelSelectStory = {};

export const WithContent: PanelSelectStory = {
  args: {
    size: 'small',
    data: [
      {
        icon: <City />,
        label: 'John Doe',
        helperText: '123 Elm Street, 10001 New York',
        value: '1',
        disabled: true,
        children: (
          <FlexBetween>
            <div>
              <Paragraph fontWeight={500}>Early release</Paragraph>
              <SmallText color="text.secondary">Get included on new features.</SmallText>
            </div>

            <Switch defaultChecked />
          </FlexBetween>
        ),
      },
      {
        icon: <City />,
        label: 'Jane Smith',
        helperText: '456 Baker Street, SW1A 1AA London (Disabled)',
        value: '2',
        disabled: true,
        children: (
          <Box>
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
      {
        icon: <City />,
        label: 'Akira Tanaka',
        helperText: '789 Sakura Avenue, 100-0001 Tokyo',
        value: '3',
        deleteable: true,
        children: <H5>This is more content</H5>,
      },
    ],
  },
};

export const Horizontal: PanelSelectStory = {
  args: {
    direction: 'horizontal',
    size: 'small',
  },
};

export const Disabled: PanelSelectStory = {
  args: {
    disabled: true,
  },
};

export const Small: PanelSelectStory = {
  args: {
    size: 'small',
  },
};

export const Large: PanelSelectStory = {
  args: {
    size: 'large',
  },
};
