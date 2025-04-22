import { Box } from '@mui/material';
import Stack from '@mui/material/Stack';
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
      },
      {
        icon: <City />,
        label: 'Akira Tanaka',
        helperText: '789 Sakura Avenue, 100-0001 Tokyo',
        value: '3',
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
        defaultValues={{ addressId: null }}
        showHeader={false}
      >
        <Page.Content>
          <Box sx={{ width: 300 ,mb:5}}>
            <Story />
            <Field.Button
              onClick={(form) => form.setValue('addressId', null, { shouldValidate: true })}
            >
              Reset
            </Field.Button>
          </Box>
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
type RadioGroupStory = StoryObj<typeof Field.RadioGroup>;

export const Simple: RadioGroupStory = {};

export const WithLabel: RadioGroupStory = {
  args: {
    label: 'Gender',
  },
};
