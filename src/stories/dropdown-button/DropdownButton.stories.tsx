import { AccessAlarmOutlined, AccountBalance, Payment } from '@mui/icons-material';
import { Meta, StoryObj } from '@storybook/react';

import DropdownButton from '../../components/dropdown-button/DropdownButton';

const meta: Meta<typeof DropdownButton> = {
  title: 'Components/DropdownButton',
  args: {
    children: 'Pay it',
    startIcon: <Payment />,
    options: [
      {
        label: 'Pay with service selection',
        helperText: 'Select a service to pay for',
        value: 'option1',
        icon: <Payment />,
      },
      {
        label: 'Pay with doc selection',
        helperText: 'Select a document to pay for',
        value: 'option2',
        icon: <AccountBalance />,
      },
      {
        label: 'Pay it',
        helperText: 'Select a time to pay for',
        value: 'option3',
        icon: <AccessAlarmOutlined />,
        disabled: true,
      },
    ],
  },
  component: DropdownButton,
};

export default meta;
type DropdownButtonStory = StoryObj<typeof DropdownButton>;

export const Simple: DropdownButtonStory = {};

export const Small: DropdownButtonStory = {
  args: {
    size: 'small',
  },
};
export const Disabled: DropdownButtonStory = {
  args: {
    disabled: true,
  },
};

export const Success: DropdownButtonStory = {
  args: {
    color: 'success',
  },
};

export const Warning: DropdownButtonStory = {
  args: {
    color: 'warning',
  },
};

export const Loading: DropdownButtonStory = {
  args: {
    loading: true,
    options: [],
  },
};

export const LongList: DropdownButtonStory = {
  args: {
    dropDownHeight: 300,
    options: Array.from({ length: 20 }).map((_, index) => ({
      label: `Option ${index + 1}`,
      value: `option${index + 1}`,
    })),
  },
};
