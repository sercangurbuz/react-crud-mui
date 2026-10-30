import { Meta, StoryObj } from '@storybook/react';

import Labels from '../../components/labels';

const meta: Meta<typeof Labels.PhoneFormat> = {
  title: 'Components/Labels/PhoneFormat',
  component: Labels.PhoneFormat,
  args: {
    value: '+905332153336',
  },
};
export default meta;

type Story = StoryObj<typeof Labels.PhoneFormat>;

export const Simple: Story = {};

export const WithUndefinedMessage: Story = {
  args: {
    value: undefined,
    showUndefinedMessage: true,
    unDefinedMessage: 'No phone number provided',
  },
};
