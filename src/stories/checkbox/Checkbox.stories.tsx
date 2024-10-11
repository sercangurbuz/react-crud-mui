import { Box, Paper, Stack } from '@mui/material';
import { Meta, StoryObj } from '@storybook/react';
import { z } from 'zod';

import DetailPage from '../../components/detail-page';
import Field from '../../components/form/Field';
import Page from '../../components/page/Page';

const meta: Meta<typeof Field.Checkbox> = {
  title: 'Components/Checkbox',
  args: {
    name: 'isActive',
    label: 'Is Active ?',
  },
  component: Field.Checkbox,
  decorators: (Story) => {
    return (
      <DetailPage
        schema={z.object({
          isActive: z.boolean(),
        })}
        defaultValues={{ isActive: false }}
        showHeader={false}
      >
        <Page.Content>
          <Stack direction="row" spacing={3}>
            <Box sx={{ flex: 1 / 2 }}>
              <Story />
            </Box>
            <Field.Button
              onClick={(form) => form.setValue('isActive', false, { shouldValidate: true })}
            >
              Reset
            </Field.Button>
          </Stack>
        </Page.Content>
        <Page.Divider />
        <Page.Content>
          <Field.Watch name="isActive" label="Selected Value" showAsJson />
        </Page.Content>
      </DetailPage>
    );
  },
};

export default meta;
type CheckboxStory = StoryObj<typeof Field.Checkbox>;

export const Simple: CheckboxStory = {};

export const WithDescription: CheckboxStory = {
  args: {
    helperText: 'Uncheck if user is disabled',
  },
};
