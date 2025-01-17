import Stack from '@mui/material/Stack';
import { Meta, StoryObj } from '@storybook/react';
import { z } from 'zod';

import DetailPage from '../../components/detail-page';
import Field from '../../components/form/Field';
import Page from '../../components/page/Page';

const meta: Meta<typeof Field.RadioGroup> = {
  title: 'Components/RadioGroup',
  args: {
    data: [
      {
        label: 'Female',
        value: 'female',
      },
      {
        label: 'Male',
        value: 'male',
      },
      {
        label: 'Other',
        value: 'other',
      },
    ],
    name: 'gender',
  },
  component: Field.RadioGroup,
  decorators: (Story) => {
    return (
      <DetailPage
        schema={z.object({
          gender: z.enum(['female', 'male', 'other']),
        })}
        validationOptions={{ callOutVisibility: 'all' }}
        defaultValues={{ gender: null }}
        showHeader={false}
      >
        <Page.Content>
          <Stack direction="row" spacing={3}>
            <Story />
            <Field.Button
              onClick={(form) => form.setValue('gender', null, { shouldValidate: true })}
            >
              Reset
            </Field.Button>
          </Stack>
        </Page.Content>
        <Page.Divider />
        <Page.Content>
          <Field.Watch name="gender" label="Selected Gender" sx={{ marginTop: 3 }} />
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
