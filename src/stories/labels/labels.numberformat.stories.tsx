import { Meta, StoryObj } from '@storybook/react';

import Labels from '../../components/labels';

const meta: Meta<typeof Labels.NumberFormat> = {
  title: 'Components/Labels/NumberFormat',
  component: Labels.NumberFormat,
  args: {
    value: 1535.98,
    suffix: ' kg.',
  },
};
export default meta;

type Story = StoryObj<typeof Labels.NumberFormat>;

export const Simple: Story = {};
