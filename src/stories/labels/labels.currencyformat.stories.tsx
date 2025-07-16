import { Meta, StoryObj } from '@storybook/react';

import Labels from '../../components/labels';
import { H5 } from '../../components/typography';

const meta: Meta<typeof Labels.CurrencyFormat> = {
  title: 'Components/Labels/CurrencyFormat',
  component: Labels.CurrencyFormat,
  args: {
    value: 1535.98,
    currency: 'TL',
  },
};
export default meta;

type Story = StoryObj<typeof Labels.CurrencyFormat>;

export const Simple: Story = {};  
export const Zero: Story = {
  args:{
    value:0
  }
};  
export const Custom: Story = {
  args: {
    component: H5,
    suffix: '(C)',
    sx: {
      color: 'warning.main',
    },
  },
};
