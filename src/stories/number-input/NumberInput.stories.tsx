import { Box, Stack } from '@mui/material';
import { Meta, StoryObj } from '@storybook/react';
import { z } from 'zod';

import DetailPage from '../../components/detail-page';
import Field from '../../components/form/Field';
import Page from '../../components/page/Page';

const meta: Meta<typeof Field.NumberInput> = {
  title: 'Components/NumberInput',
  args: {
    name: 'value',
    label: 'Numeric value',
  },
  component: Field.NumberInput,
  decorators: (Story) => {
    return (
      <DetailPage
        schema={z.object({
          value: z.number().max(99),
        })}
        validationOptions={{ callOutVisibility: 'all' }}
        defaultValues={{ value: null }}
        showHeader={false}
      >
        <Page.Content>
          <Stack direction="row" spacing={3}>
            <Box sx={{ flex: 1 / 2 }}>
              <Story />
            </Box>
            <Field.Button
              onClick={(form) => form.setValue('value', null, { shouldValidate: true })}
            >
              Reset
            </Field.Button>
          </Stack>
        </Page.Content>
        <Page.Divider />
        <Page.Content>
          <Field.Watch name="value" label="Selected Value" />
        </Page.Content>
      </DetailPage>
    );
  },
};

export default meta;
type NumberInputStory = StoryObj<typeof Field.NumberInput>;

export const Simple: NumberInputStory = {};

export const DecimalPart: NumberInputStory = {
  args: {
    decimalScale: 2,
  },
};
