import { Box, Stack } from '@mui/material';
import { Meta, StoryObj } from '@storybook/react';
import { z } from 'zod';

import DetailPage from '../../components/detail-page';
import Field from '../../components/form/Field';
import { phoneSchema } from '../../components/form/schema';
import Page from '../../components/page/Page';

const meta: Meta<typeof Field.PhoneInput> = {
  title: 'Components/PhoneInput',
  args: {
    name: 'phone',
    label: 'Phone number',
  },
  component: Field.PhoneInput,
  decorators: (Story) => {
    return (
      <DetailPage
        schema={z.object({
          phone: phoneSchema,
        })}
        validationOptions={{ callOutVisibility: 'all' }}
        defaultValues={{ phone: '' }}
        showHeader={false}
      >
        <Page.Content>
          <Stack direction="row" spacing={3}>
            <Box sx={{ flex: 1 / 2 }}>
              <Story />
            </Box>
            <Field.Button onClick={(form) => form.setValue('phone', '', { shouldValidate: true })}>
              Reset
            </Field.Button>
          </Stack>
        </Page.Content>
        <Page.Divider />
        <Page.Content>
          <Field.Watch name="phone" label="Selected Value" />
        </Page.Content>
      </DetailPage>
    );
  },
};

export default meta;
type PhoneInputStory = StoryObj<typeof Field.PhoneInput>;

export const Simple: PhoneInputStory = {};
