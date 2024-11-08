import { Stack } from '@mui/material';
import { Meta, StoryObj } from '@storybook/react';
import { z } from 'zod';

import DetailPage from '../../components/detail-page';
import { FlexBox } from '../../components/flexbox';
import Field from '../../components/form/Field';
import Page from '../../components/page/Page';
import { Small, Tiny } from '../../components/typography';
import mockData from '../../test-setup/mockUsers.json';

const meta: Meta<typeof Field.Select> = {
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
        schema={z.object({ userId: z.number() })}
        defaultValues={{ userId: 1 }}
        showHeader={false}
      >
        <Page.Content>
          <Stack direction="row" spacing={3}>
            <Story />
            <Field.Button
              onClick={(form) => form.setValue('userId', null, { shouldValidate: true })}
            >
              Reset
            </Field.Button>
          </Stack>
        </Page.Content>
        <Page.Divider />
        <Page.Content>
          <Field.Watch name="userId" label="User ID" />
        </Page.Content>
      </DetailPage>
    );
  },
};

export default meta;
type SelectStory = StoryObj<typeof Field.Select>;

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
      return option?.position.title;
    },
  },
};

export const WithMaxHeight: SelectStory = {
  args: {
    ...Grouping.args,
    dropDownHeight: 300,
  },
};
