import { Meta, StoryObj } from '@storybook/react';
import dayjs from 'dayjs';

import Labels from '../../components/labels';
import { H5 } from '../../components/typography';

const currentDate = dayjs();

const meta: Meta<typeof Labels.DateFormat> = {
  title: 'Components/Labels/DateFormat',
  component: Labels.DateFormat,
  args: {
    date: currentDate,
  },
};
export default meta;

type Story = StoryObj<typeof Labels.DateFormat>;

export const Simple: Story = {};
export const WithTime: Story = {
  args: {
    enableTime: true,
  },
};

export const FromString: Story = {
  args: {
    date: currentDate.format('DD-MM-YYYY'),
    stringFormat: 'DD-MM-YYYY',
  },
};

export const Custom: Story = {
  args: {
    component: H5,
    sx: {
      color: 'warning.main',
    },
  },
};
