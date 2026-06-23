import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { Meta, StoryObj } from '@storybook/react';
import { z } from 'zod';

import { schemas } from '../..';
import DetailPage from '../../components/detail-page';
import Field from '../../components/form/Field';
import Page from '../../components/page/Page';

const dateRangeSchema = z.object({
  dateRange: z.tuple([
    schemas.dateSchema.nullable().optional(),
    schemas.dateSchema.nullable().optional(),
  ]),
});

type FormValues = z.infer<typeof dateRangeSchema>;

const defaultValues: FormValues = {
  dateRange: ['2025-01-01T00:00:00.000Z', '2025-03-31T00:00:00.000Z'],
};

const meta: Meta<typeof Field.DateRangePicker> = {
  title: 'Components/DateRangePicker',
  args: {
    name: 'dateRange',
    label: 'Date range value',
  },
  component: Field.DateRangePicker,
  decorators: (Story) => (
    <DetailPage
      schema={dateRangeSchema}
      validationOptions={{ callOutVisibility: 'all' }}
      defaultValues={defaultValues}
      showHeader={false}
    >
      <Page.Content>
        <Stack spacing={3}>
          <Box>
            <Story name="dateRange" />
          </Box>
          <Stack direction="row" spacing={2}>
            <Field.Button
              onClick={(form) => form.setValue('dateRange', [null, null], { shouldValidate: true })}
            >
              Clear Range
            </Field.Button>
          </Stack>
        </Stack>
      </Page.Content>
      <Page.Divider />
      <Page.Content>
        <Stack spacing={2}>
          <Field.Watch name="dateRange" label="Date Range" showAsJson />
        </Stack>
      </Page.Content>
    </DetailPage>
  ),
};

export default meta;
type DateRangePickerStory = StoryObj<typeof Field.DateRangePicker>;

export const Simple: DateRangePickerStory = {};

export const Disabled: DateRangePickerStory = {
  args: {
    disabled: true,
  },
};

export const AllowEmpty: DateRangePickerStory = {
  args: {
    allowEmpty: [true, false],
  },
};
