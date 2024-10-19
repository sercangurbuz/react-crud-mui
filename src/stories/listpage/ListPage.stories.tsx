import { useCallback, useMemo } from 'react';

import { Search } from '@mui/icons-material';
import { Meta, StoryObj } from '@storybook/react';

import ListPage from '../../components/listpage/pages/ListPage';
import { ListPageFilter, PagingListModel } from '../../components/listpage/pages/ListPageData';
import { useAppLazyQuery } from '../../components/query';
import { ServerError } from '../../components/utils';
import { UserDefaultValues } from '../utils/api';
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
        enableSorting: false,
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
    defaultValues: UserDefaultValues,
  },
  component: ListPage,
};

export default meta;
type ListPageStory = StoryObj<typeof ListPage<UserSchema, UserSchema>>;

export const Simple: ListPageStory = {
  render(args) {
    const { fetch, data, isPending, error, prevData } = useAppLazyQuery<UserSchema[]>({
      url: 'https://jsonplaceholder.typicode.com/users',
    });
    const users = useMemo<PagingListModel<UserSchema>>(
      () => ({
        data: data ?? prevData ?? [],
        dataCount: data || prevData ? 10 : 0,
      }),
      [data, prevData],
    );

    const handleNeedData = useCallback(
      ({
        name,
        username,
        email,
        website,
        phone,
        pagination,
        sorting,
      }: ListPageFilter<UserSchema>) =>
        fetch({
          name_like: name && `^${name}`,
          username_like: username && `^${username}`,
          email_like: email && `^${email}`,
          website_like: website && `^${website}`,
          phone_like: phone && `^${phone}`,
          _page: pagination?.pageIndex + 1,
          _limit: pagination?.pageSize,
          _sort: sorting.map(({ desc, id }) => `${desc ? '-' : ''}${id}`).join(),
        }),
      [],
    );

    return (
      <ListPage
        {...args}
        onNeedData={handleNeedData}
        tableProps={{
          initialState: {
            pagination: { pageSize: 5 },
          },
        }}
        data={users}
        loading={isPending}
        error={error as ServerError}
      />
    );
  },
};
