import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { Meta, StoryObj } from '@storybook/react';
import { z } from 'zod';

import DetailPage from '../../components/detail-page';
import Field from '../../components/form/Field';
import Page from '../../components/page/Page';

const meta: Meta<typeof Field.Switch> = {
  title: 'Components/Switch',
  args: {
    name: 'isActive',
    label: 'Is Active ?',
  },
  component: Field.Switch,
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
type SwitchStory = StoryObj<typeof Field.Switch>;

export const Simple: SwitchStory = {};
export const Disabled: SwitchStory = {
  args: {
    disabled: true,
  },
};

export const FullWidth: SwitchStory = {
  args: {
    wrapperProps: {
      justifyContent: 'space-between',
    },
  },
};

export const WithDescription: SwitchStory = {
  args: {
    helperText: 'Uncheck if user is disabled',
  },
};

export const WithCustomStyle: SwitchStory = {
  args: {
    size: 'small',
    label: ['Passive', 'Active'],
    labelProps: {
      sx: {
        fontSize: 12,
        color: 'text.secondary',
      },
    },
  },
};
