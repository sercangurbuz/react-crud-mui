import { Meta, StoryObj } from '@storybook/react';

import { FlexBox } from '../../components/flexbox';
import Labels from '../../components/labels';
import { H5 } from '../../components/typography';
import CurrencySwitcher from './components/CurrencySwitcher';

const meta: Meta<typeof Labels.CurrencyFormat> = {
  title: 'Components/Labels/CurrencyFormat',
  component: Labels.CurrencyFormat,
  args: {
    value: 1535.98,
  },
  decorators: (Story) => (
    <FlexBox flexDirection="column" gap={3}>
      <Story />
      <CurrencySwitcher />
    </FlexBox>
  ),
};
export default meta;

type Story = StoryObj<typeof Labels.CurrencyFormat>;

export const Simple: Story = {};
export const Zero: Story = {
  args: {
    value: 0,
  },
};
export const Custom: Story = {
  args: {
    component: H5,
    suffix: ' (C)',
    sx: {
      color: 'warning.main',
    },
  },
};
