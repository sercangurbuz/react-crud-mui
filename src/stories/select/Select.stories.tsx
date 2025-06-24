import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import { Meta, StoryObj } from '@storybook/react';
import { z } from 'zod';

import DetailPage from '../../components/detail-page';
import { FlexBox } from '../../components/flexbox';
import Field from '../../components/form/Field';
import Page from '../../components/page/Page';
import { Small, Tiny } from '../../components/typography';
import mockData from '../../test-setup/mockUsers.json';
import { UserSchema } from '../utils/schema';

const meta: Meta<typeof Field.Select<UserSchema>> = {
  title: 'Components/Select',
  args: {
    data: mockData,
    name: 'userId',
    label: 'User',
    optionTemplate: '${username}',
    autoFocus: true,
  },
  component: Field.Select,
  decorators: (Story) => {
    return (
      <DetailPage
        schema={z.object({ userId: z.number({ message: 'User is missing' }) })}
        validationOptions={{ callOutVisibility: 'all' }}
        defaultValues={{ userId: null }}
        showHeader={false}
      >
        <Page.Content>
          <Stack direction="row" spacing={3}>
            <Story />
            <Field.Button onClick={(form) => form.setValue('userId', 3, { shouldValidate: true })}>
              Reset
            </Field.Button>
          </Stack>
        </Page.Content>
        <Page.Divider />
        <Page.Content>
          <Field.Watch name="userId" label="Selected User" showAsJson />
        </Page.Content>
      </DetailPage>
    );
  },
};

export default meta;
type SelectStory = StoryObj<typeof Field.Select<UserSchema>>;

export const Simple: SelectStory = {};
export const Disabled: SelectStory = {
  args: {
    disabled: true,
  },
};

export const WithDescription: SelectStory = {
  args: {
    descriptionTemplate: '${email}',
  },
};

export const OptionAsValue: SelectStory = {
  args: {
    optionAsValue: true,
  },
};

export const SelectFirstOption: SelectStory = {
  args: {
    selectInitialOption: true,
    data: undefined,
  },
  loaders: [
    async () => ({
      users: await (await fetch('https://jsonplaceholder.typicode.com/users')).json(),
    }),
  ],
  render(args, { loaded: { users } }) {
    return <Field.Select {...args} data={users} />;
  },
};

export const SelectInitialOption: SelectStory = {
  ...SelectFirstOption,
  args: {
    selectInitialOption(model) {
      return model.id === 3;
    },
    data: undefined,
  },
};

export const WithSmallerSize: SelectStory = {
  args: {
    size: 'smaller',
  },
};

export const WithExtraItem: SelectStory = {
  args: {
    allowClear: false,
    displayTemplate(model: UserSchema) {
      return model.email;
    },
    children: (
      <MenuItem key="-1" value={-1}>
        All users
      </MenuItem>
    ),
  },
};

export const CustomRender: SelectStory = {
  args: {
    ...WithDescription.args,
    displayTemplate(model) {
      return (
        <FlexBox flexDirection="column">
          <Small sx={{ color: 'primary.main' }}>{model.username}</Small>
          <Tiny sx={{ color: 'primary.light' }}>{model.email}</Tiny>
        </FlexBox>
      );
    },
  },
};

export const Grouping: SelectStory = {
  args: {
    data: mockData.sort((a, b) => a.position.id - b.position.id),
    groupBy(option) {
      return option.position!.title;
    },
  },
};

export const WithMaxHeight: SelectStory = {
  args: {
    ...Grouping.args,
    dropDownHeight: 300,
  },
};
