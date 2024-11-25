import { Meta, StoryObj } from '@storybook/react';

import Labels from '../../components/labels';

const meta: Meta<typeof Labels.PhoneFormat> = {
  title: 'Components/Labels/PhoneFormat',
  component: Labels.PhoneFormat,
  args: {
    value: '5332153336',
  },
};
export default meta;

type Story = StoryObj<typeof Labels.PhoneFormat>;

export const Simple: Story = {};
