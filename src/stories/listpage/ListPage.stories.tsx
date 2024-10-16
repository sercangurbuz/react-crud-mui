import { useCallback, useMemo } from 'react';

import { Search } from '@mui/icons-material';
import { Meta, StoryObj } from '@storybook/react';

import ListPage from '../../components/listpage/pages/ListPage';
import { PagingListModel } from '../../components/listpage/pages/ListPageData';
import { useAppLazyQuery } from '../../components/query';
import { ServerError } from '../../components/utils';
import { UserSchema } from '../utils/schema';
import FilterContent from './components/FilterContent';

const meta: Meta<typeof ListPage> = {
  title: 'Components/ListPage',
  args: {
    header: 'User list',
    helperText: 'Type in user settings',
    icon: <Search sx={{ color: 'primary.main' }} />,
    filter: () => <FilterContent />,
    createCommandLabel: 'New User',
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
        cell(props) {
          return <a href={`mailto:${props.getValue()}`}>{props.renderValue() as string}</a>;
        },
      },
      {
        id: 'address',
        accessorFn: (row) =>
          `${row.address?.street} ${row.address?.suite} ${row.address?.city} ${row.address?.zipcode}`,
      },
      {
        accessorKey: 'phone',
        header: 'Phone',
      },
      {
        accessorKey: 'website',
        header: 'WebSite',
      },
    ],
  },
  component: ListPage,
};

export default meta;
type ListPageStory = StoryObj<typeof ListPage<UserSchema, UserSchema>>;

export const Simple: ListPageStory = {
  render(args) {
    const { fetch, data, isPending, error } = useAppLazyQuery<UserSchema[]>({
      url: 'https://jsonplaceholder.typicode.com/users',
    });
    const users = useMemo<PagingListModel<UserSchema>>(
      () => ({
        data: data ?? [],
        dataCount: data ? 10 : 0,
      }),
      [data],
    );

    const handleNeedData = useCallback(
      ({
        name,
        username,
        email,
        website,
        phone,
        /* pageIndex,
        pageSize, */
      }: UserSchema) =>
        fetch({
          name_like: name && `^${name}`,
          username_like: username && `^${username}`,
          email_like: email && `^${email}`,
          website_like: website && `^${website}`,
          phone_like: phone && `^${phone}`,
          /* _page: ++pageIndex!,
          _limit: pageSize, */
        }),
      [],
    );

    return (
      <ListPage
        {...args}
        onNeedData={handleNeedData}
        data={users}
        loading={isPending}
        error={error as ServerError}
      />
    );
  },
};
