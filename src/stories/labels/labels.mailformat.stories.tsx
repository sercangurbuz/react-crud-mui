import { Meta, StoryObj } from '@storybook/react';

import Labels from '../../components/labels';

const meta: Meta<typeof Labels.MailFormat> = {
  title: 'Components/Labels/MailFormat',
  component: Labels.MailFormat,
  args: {
    value: 'sercangurbuz@msn.com',
  },
};
export default meta;

type Story = StoryObj<typeof Labels.MailFormat>;

export const Simple: Story = {};
