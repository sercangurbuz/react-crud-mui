import { Meta, StoryObj } from '@storybook/react';

import { FlexBox } from '../../components/flexbox';
import Tag from '../../components/tag';

const meta: Meta<typeof Tag> = {
  title: 'Components/Tag',
  component: Tag,
  args: {
    children: 'Paid amount',
  },
};

export default meta;
type PanelStory = StoryObj<typeof Tag>;

export const Simple: PanelStory = {
  render: (args) => (
    <FlexBox gap={2} flexWrap="wrap" justifyContent="flex-start">
      <Tag type="primary" {...args} />
      <Tag type="success" {...args} />
      <Tag type="error" {...args} />
      <Tag type="warning" {...args} />
    </FlexBox>
  ),
};

export const Status: PanelStory = {
  render: (args) => (
    <FlexBox gap={2} flexWrap="wrap" justifyContent="flex-start">
      <Tag variant="status" type="primary" {...args} />
      <Tag variant="status" type="success" {...args} />
      <Tag variant="status" type="error" {...args} />
      <Tag variant="status" type="warning" {...args} />
    </FlexBox>
  ),
};

export const Percentage: PanelStory = {
  render: (args) => (
    <FlexBox gap={2} flexWrap="wrap" justifyContent="flex-start">
      <Tag variant="percentage" type="primary" {...args} />
      <Tag variant="percentage" type="success" {...args} />
      <Tag variant="percentage" type="error" {...args} />
      <Tag variant="percentage" type="warning" {...args} />
    </FlexBox>
  ),
};
