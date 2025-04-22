import { Settings } from '@mui/icons-material';
import { Box, IconButton } from '@mui/material';
import { Meta, StoryObj } from '@storybook/react';
import { z } from 'zod';

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
        label: 'Jane Smith',
        helperText: '456 Baker Street, SW1A 1AA London',
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
