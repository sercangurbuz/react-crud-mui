import { Meta, StoryObj } from '@storybook/react';
import { z } from 'zod';

import DetailPage from '../../components/detail-page/pages/DetailPage';
import EditableList from '../../components/editable-list/EditableList';
import User from '../../components/icons/User';
import mockUsers from '../../test-setup/mockUsers.json';
import FormContent from '../detail-page/components/FormContent';
import { UserDefaultValues } from '../utils/api';
import { userSchema, UserSchema } from '../utils/schema';

type MockUsers = { users: UserSchema[] };
const data: MockUsers = { users: mockUsers };

const meta: Meta<typeof EditableList<MockUsers, UserSchema, 'users'>> = {
  title: 'Components/EditableList',
  component: EditableList,
  args: {
    name: 'users',
    newItemTitle: 'New Person',
    headerProps: {
      header: 'Top performing users',
      helperText: 'Counted in Millions',
      icon: <User />,
    },
    showNewRowButton: 'always',
    enableRowClickToDetails: 'fetch',
    detailPageProps: {
      schema: userSchema,
      title: 'Person Details',
      defaultValues: UserDefaultValues,
      children: <FormContent />,
    },
    columns: [
      {
        accessorKey: 'name',
        header: 'Name',
      },
      {
        accessorKey: 'username',
        header: 'User name',
      },
      {
        accessorKey: 'email',
        header: 'Email',
        cell(props) {
          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
          return <a href={`mailto:${props.getValue()}`}>{props.renderValue() as string}</a>;
        },
      },
      {
        id: 'address',
        header: 'Address',
        enableSorting: false,
        accessorFn: (row) =>
          `${row.address?.street} ${row.address?.suite} ${row.address?.city} ${row.address?.zipcode}`,
      },
    ],
  },
  decorators: (Story) => {
    return (
      <DetailPage
        reason="fetch"
        data={data}
        showHeader={false}
        schema={z.object({ users: z.array(userSchema).min(1) })}
      >
        <Story />
      </DetailPage>
    );
  },
};
export default meta;

type Story = StoryObj<typeof EditableList<MockUsers, UserSchema, 'users'>>;

export const Simple: Story = {};

export const WithUniqueFields: Story = {
  ...Simple,
  args: {
    uniqueFields: [
      { fields: ['email'], message: 'Email must be unique' },
      { fields: ['username'], message: 'Username must be unique' },
    ],
  },
};
