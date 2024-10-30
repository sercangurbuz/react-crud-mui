import { useEffect, useState } from 'react';

import { Assignment, Done, Pending, Search } from '@mui/icons-material';
import { Alert, AlertTitle, Button, Stack } from '@mui/material';
import { Meta, StoryObj } from '@storybook/react';
import { RowSelectionState } from '@tanstack/react-table';
import { z } from 'zod';

import ListPage from '../../components/listpage/pages/ListPage';
import { ServerError } from '../../components/utils';
import mockUsers from '../../test-setup/mockUsers.json';
import { UserDefaultValues } from '../utils/api';
import { UserSchema } from '../utils/schema';
import useSession from '../utils/useSession';
import EmbededDetailPage from './components/EmbededDetailPage';
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
type ListPageSelectionStory = StoryObj<typeof ListPage.Selection<UserSchema>>;

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

export const WithErrorAsyncData: ListPageStory = {
  args: {},
  render: (args) => {
    const [loading, setloading] = useState(true);
    const [error, setError] = useState<ServerError>();

    const callError = (error: string) => {
      setTimeout(() => {
        setloading(false);
        setError({ message: error });
      }, 1500);
    };

    return (
      <ListPage
        {...args}
        loading={loading}
        error={error}
        onExtraCommands={() => {
          return (
            <Button
              onClick={() => {
                setloading(true);
                callError('Saving failed');
              }}
            >
              Call external endpoint
            </Button>
          );
        }}
        onNeedData={() => {
          setloading(true);
          callError('Fetching data failed');
        }}
      />
    );
  },
};

export const TemporaryFilter: ListPageStory = {
  name: 'Remember filter (Temporary filter)',
  render: (args, { id }) => {
    const [value, setValue] = useSession<any>({ name: id });
    const [mounted, setMounted] = useState(true);

    return (
      <Stack>
        <Button sx={{ width: 200 }} onClick={() => setMounted((p) => !p)}>
          {!mounted ? 'MOUNT' : 'UNMOUNT'}
        </Button>

        <Alert sx={{ borderRadius: 0, my: 2 }}>
          <AlertTitle>Stored Filters</AlertTitle>
          {value && JSON.stringify(value)}
        </Alert>

        {mounted ? (
          <ListPage
            {...args}
            style={{ marginBottom: 5 }}
            defaultFilter={value}
            onNeedData={(filter) => {
              setValue(filter);
              args.onNeedData?.(filter);
            }}
          />
        ) : null}
      </Stack>
    );
  },
};

export const WithDetailPage: ListPageStory = {
  args: {
    enableCreateItem: true,
    detailPage: EmbededDetailPage,
    actionCommandsProps: {
      showCopy: false,
    },
    createCommandLabel: 'New User',
  },
};

export const Selection: ListPageSelectionStory = {
  name: 'Selection Modal',
  args: {
    //    selectButtonText: 'Select Person & Close',
  },
  render: (args) => {
    const [visible, setVisible] = useState<boolean>(true);
    const [selectedKeys, setSelected] = useState<RowSelectionState>({ 1: true, 2: true });
    return (
      <>
        <Button onClick={() => setVisible(true)}>Toggle ListPage Selection</Button>
        <ListPage.Selection
          {...args}
          defaultRowSelection={selectedKeys}
          open={visible}
          onClose={() => setVisible(false)}
          onSelect={(selection) => {
            alert('You selected row id(s): ' + Object.keys(selection).join(','));
            setSelected(selection);
            setVisible(false);
          }}
        />
      </>
    );
  },
};
