/* eslint-disable react-hooks/rules-of-hooks */

import { Card } from '@mui/material';
import { Meta, StoryObj } from '@storybook/react';
import { z } from 'zod';

import DetailPage from '../../components/detail-page/pages/DetailPage';
import EditableList from '../../components/editable-list/EditableList';
import User from '../../components/icons/User';
import Page from '../../components/page/Page';
import { isDark } from '../../components/theme/theme.constants';
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
    detailPageProps: {
      schema: userSchema,
      title: 'Person Details',
      defaultValues: UserDefaultValues,
      children: <FormContent />,
      header: 'User Detail',
    },
    headerProps: {
      header: 'Top performing users',
      helperText: 'Counted in Millions',
      icon: <User />,
      headerProps: {
        fontSize: 18,
        fontWeight: 500,
      },
    },
    columns: [
      {
        accessorKey: 'name',
        header: 'NAME',
      },
      {
        accessorKey: 'username',
        header: 'USER NAME',
      },
      {
        accessorKey: 'email',
        header: 'E-MAIL',
        cell(props) {
          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
          return <a href={`mailto:${props.getValue()}`}>{props.renderValue() as string}</a>;
        },
      },
      {
        id: 'address',
        header: 'ADDRESS',
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
        <Page.Content>
          <Card
            sx={{
              backgroundColor: (theme) => (isDark(theme) ? 'grey.900' : 'primary.25'),
            }}
          >
            <Story />
          </Card>
        </Page.Content>
      </DetailPage>
    );
  },
};
export default meta;

type Story = StoryObj<typeof EditableList<MockUsers, UserSchema, 'users'>>;

export const Simple: Story = {};
