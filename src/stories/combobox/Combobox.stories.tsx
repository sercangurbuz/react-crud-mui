import { Chip, Stack } from '@mui/material';
import { Meta, StoryObj } from '@storybook/react';
import { z } from 'zod';

import DetailPage from '../../components/detail-page';
import { FlexBetween } from '../../components/flexbox';
import Field from '../../components/form/Field';
import Page from '../../components/page/Page';
import { Paragraph } from '../../components/typography';
import mockData from '../../test-setup/mockUsers.json';

const meta: Meta<typeof Field.Combobox> = {
  title: 'Components/Combobox',
  args: {
    data: mockData,
    name: 'user',
    label: 'User',
    optionTemplate: '${username}',
    autoFocus: true,
  },
  component: Field.Combobox,
  decorators: (Story) => {
    return (
      <DetailPage
        schema={z.object({
          user: z.object({
            id: z.number(),
            name: z.string(),
          }),
        })}
        defaultValues={{ user: null }}
        showHeader={false}
      >
        <Page.Content>
          <Stack direction="row" spacing={3}>
            <Story />
            <Field.Button onClick={(form) => form.setValue('user', null, { shouldValidate: true })}>
              Reset
            </Field.Button>
          </Stack>
        </Page.Content>
        <Page.Divider />
        <Page.Content>
          <Field.Watch name="user" label="User" showAsJson />
        </Page.Content>
      </DetailPage>
    );
  },
};

export default meta;
type ComboboxStory = StoryObj<typeof Field.Combobox>;

export const Simple: ComboboxStory = {};

export const WithDescription: ComboboxStory = {
  args: {
    descriptionTemplate: '${email}',
  },
};

export const WithCustomDisplay: ComboboxStory = {
  args: {
    ...WithDescription.args,
    displayTemplate: '${username} - ${email}',
  },
};

export const WithCustomOption: ComboboxStory = {
  args: {
    displayTemplate(model) {
      return model.name;
    },
    optionTemplate(model) {
      return (
        <FlexBetween width="100%">
          <Paragraph>{model.username}</Paragraph>
          <Chip color="secondary" label={model.email}></Chip>
        </FlexBetween>
      );
    },
  },
};

export const Creatable: ComboboxStory = {
  args: {
    creatable: true,
    onCreate(text) {
      return Promise.resolve({
        id: 100,
        username: text,
      });
    },
  },
};

export const Grouping: ComboboxStory = {
  args: {
    data: mockData.sort((a, b) => a.position.id - b.position.id),
    groupBy(option) {
      return option?.position.title;
    },
  },
};
