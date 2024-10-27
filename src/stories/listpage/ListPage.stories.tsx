import { Assignment, Done, Pending, Search } from '@mui/icons-material';
import { Meta, StoryObj } from '@storybook/react';
import { z } from 'zod';

import ListPage from '../../components/listpage/pages/ListPage';
import mockUsers from '../../test-setup/mockUsers.json';
import { UserDefaultValues } from '../utils/api';
import { UserSchema } from '../utils/schema';
import FilterContent from './components/FilterContent';
import useListPageData from './components/useListPageData';

const meta: Meta<typeof ListPage<UserSchema>> = {
  title: 'Components/ListPage',
  args: {
    header: 'User list',
    helperText: 'Type in user settings',
    icon: <Search sx={{ color: 'primary.main' }} />,
    filterContent: <FilterContent />,
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
        enableSorting: false,
        header: 'Phone',
      },
      {
        accessorKey: 'website',
        header: 'WebSite',
      },
    ],
    defaultValues: UserDefaultValues,
    tableProps: {
      initialState: {
        pagination: { pageSize: 5 },
      },
    },
  },
  component: ListPage,
  decorators: (Story, context) => {
    const props = useListPageData();
    Object.assign(context.args, props);
    return Story(context);
  },
};

export default meta;
type ListPageStory = StoryObj<typeof ListPage<UserSchema>>;

export const Simple: ListPageStory = {};

export const WithDefaultValues: ListPageStory = {
  args: {
    defaultFilter: { username: 'M' },
    defaultValues: { username: 'K' },
  },
};

export const WithDefaultTableFilters: ListPageStory = {
  args: {
    enableClear: true,

    tableProps: {
      paginationProps: {
        rowsPerPageOptions: [3, 5, 10, 25],
      },
      initialState: {
        pagination: { pageSize: 3 },
        sorting: [
          {
            id: 'username',
            desc: false,
          },
        ],
      },
    },
  },
};

export const WithNoFilter: ListPageStory = {
  args: {
    filterContent: undefined,
  },
};

export const WithTabbedFilter: ListPageStory = {
  args: {
    tabs: [
      {
        key: 'tab1',
        value: 'assigned',
        label: 'Assigned',
        icon: <Assignment />,
      },
      {
        key: 'tab2',
        value: 'pending',
        label: 'Pending',
        icon: <Pending />,
      },
      {
        key: 'tab3',
        value: 'done',
        label: 'Done',
        icon: <Done />,
      },
    ],
  },
};

export const WithValidation: ListPageStory = {
  args: {
    schema: z.object({
      name: z.string().min(1),
      username: z.string().optional(),
      email: z.string(),
      website: z.string(),
      phone: z.string(),
    }),
  },
};
