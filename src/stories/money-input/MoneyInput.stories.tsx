import { useWatch } from 'react-hook-form';

import { Box, Stack } from '@mui/material';
import { Meta, StoryObj } from '@storybook/react';
import { z } from 'zod';

import DetailPage from '../../components/detail-page';
import Field from '../../components/form/Field';
import { CurrencySymbols, DEFAULT_CURRENCY } from '../../components/misc/getCurrencySymbolProps';
import Page from '../../components/page/Page';

const meta: Meta<typeof Field.MoneyInput> = {
  title: 'Components/MoneyInput',
  args: {
    name: 'value',
    label: 'Money value',
  },
  component: Field.MoneyInput,
  decorators: (Story) => {
    return (
      <DetailPage
        schema={z.object({
          value: z.number().min(10).max(9999),
          currency: z.string(),
        })}
        validationOptions={{ callOutVisibility: 'all' }}
        defaultValues={{ value: 0, currency: DEFAULT_CURRENCY }}
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
type MoneyInputStory = StoryObj<typeof Field.MoneyInput>;

export const Simple: MoneyInputStory = {};

export const CustomCurrency: MoneyInputStory = {
  render(args) {
    const curr = useWatch({ name: 'currency' });
    const currData = Object.keys(CurrencySymbols).map((curr) => ({ label: curr, value: curr }));
    return (
      <Stack spacing={1}>
        <Field.RadioGroup name="currency" data={currData} />
        <Field.MoneyInput {...args} currency={curr} />
      </Stack>
    );
  },
};
