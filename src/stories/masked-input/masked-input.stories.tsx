import { Stack } from '@mui/material';
import { Meta, StoryObj } from '@storybook/react';
import { z } from 'zod';

import DetailPage from '../../components/detail-page/pages/DetailPage';
import Field from '../../components/form/Field';
import MaskedInput from '../../components/masked-input/MaskedInput';

const meta: Meta<typeof MaskedInput> = {
  title: 'Components/MaskedInput',
  component: MaskedInput,
  args: {},
};
export default meta;

type Story = StoryObj<typeof MaskedInput>;

export const Simple: Story = {
  render() {
    return (
      <DetailPage
        defaultValues={{
          phone: '',
          repeat: null,
        }}
        bordered
        schema={z.object({
          repeat: z.coerce.number(),
          phone: z
            .string()
            .regex(
              new RegExp(
                /^0[.(/]5[0-9][0-9][.)/][. /][1-9]([0-9]){2}[.\-/]([0-9]){2}[.\-/]([0-9]){2}$/,
              ),
            ),
        })}
        showHeader={false}
        onSave={console.log}
      >
        <Stack gap={2} width={400} p={4}>
          <Field.MaskedInput name="phone" label="Phone" mask="0(599) 999-99-99" autoFocus />
          <Field.MaskedInput
            name="repeat"
            label="Repeat Sample"
            mask="9"
            maskRepeat={10}
            helperText="Repeated 10 times with number character"
            maskPlaceholder={null}
            value={"1"}
          />
        </Stack>
      </DetailPage>
    );
  },
};
