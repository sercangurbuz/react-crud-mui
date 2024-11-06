import { useState } from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

import { Assignment, Close, Done, Pending, Search } from '@mui/icons-material';
import { Alert, AlertTitle, Button, Stack } from '@mui/material';
import { Meta, StoryObj } from '@storybook/react';
import { RowSelectionState } from '@tanstack/react-table';
import { z } from 'zod';

import { FlexBox } from '../../components/flexbox';
import ListPage from '../../components/list-page/pages/ListPage';
import { ServerError } from '../../components/utils';
import { UserDefaultValues } from '../utils/api';
import { UserSchema } from '../utils/schema';
import useSession from '../utils/useSession';
import EmbededDetailPage from './components/EmbededDetailPage';
import EmbededDrawerDetailPage from './components/EmbededDrawerDetailPage';
import FilterContent from './components/FilterContent';
import ListPageWithRoute from './components/ListPageWithRoute';
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
        header: 'Email',
        cell(props) {
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
    enableCreateItem: false,
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
type ListPageModalStory = StoryObj<typeof ListPage.Modal<UserSchema>>;
type ListPageRouteStory = StoryObj<typeof ListPage.Route<UserSchema>>;

export const Simple: ListPageStory = {};

export const WithDefaultValues: StoryObj<
  typeof ListPage<{ username: string }, { username: string }>
> = {
  args: {
    alerts: [{ type: 'info', message: 'Clear default filter to default values "M" => "K"' }],
    enableClear: true,
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

export const WithDetailPageDrawer: ListPageStory = {
  name: 'With DetailPage (Drawer)',
  args: {
    enableCreateItem: true,
    detailPage: EmbededDrawerDetailPage,
    actionCommandsProps: {
      showCopy: false,
    },
    createCommandLabel: 'New User',
  },
};

export const MultiSelection: ListPageSelectionStory = {
  args: {
    //    selectButtonText: 'Select Person & Close',
  },
  render: (args) => {
    const [visible, setVisible] = useState<boolean>(true);
    const [selectedKeys, setSelected] = useState<RowSelectionState>({ 2: true });
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

export const SingleSelection: ListPageSelectionStory = {
  ...MultiSelection,
  args: {
    tableProps: {
      enableMultiRowSelection: false,
    },
  },
};

export const InModal: ListPageModalStory = {
  name: 'ListPage in Modal',
  args: {
    showHeader: false,
    enableSearch: false,
    filterContent: null,
    enableClear: false,
    commandsPosition: 'bottom-right',
  },
  render: (args) => {
    const [visible, setVisible] = useState<boolean>(true);
    return (
      <>
        <Button onClick={() => setVisible(true)}>Toggle ListPage Modal</Button>
        <ListPage.Modal
          {...args}
          open={visible}
          onClose={() => setVisible(false)}
          onCommands={() => (
            <Button
              color="secondary"
              variant="outlined"
              onClick={() => setVisible(false)}
              startIcon={<Close />}
            >
              Close
            </Button>
          )}
        />
      </>
    );
  },
};

export const Notifications: ListPageStory = {
  name: 'Error Notifications (Alerts)',
  args: {
    alerts: [
      {
        type: 'info',
        message: 'Please search first !',
      },
      {
        type: 'success',
        message: 'Your searched succesfully !',
      },
      'Saving failed',
    ],
  },
};

export const WithExtraCommands: ListPageStory = {
  args: {
    onExtraCommands: () => (
      <>
        <Button color="warning">Extra Command 1</Button>
        <Button color="success">Extra Command 2</Button>
      </>
    ),
  },
};

export const WithOnCommands: ListPageStory = {
  args: {
    onCommands({ content }) {
      return (
        <FlexBox gap={1}>
          <Button color="warning">Extra Command 1</Button>
          <Button color="success">Extra Command 2</Button>
          {content}
        </FlexBox>
      );
    },
  },
};

export const AutoSearch: ListPageStory = {
  name: 'AutoSearch Mode',
  args: {
    autoSearch: true,
  },
};

export const FilterFromQuerystring: ListPageRouteStory = {
  args: {
    enableQueryStringFilter: true,
    enableClear: true,
  },
  render: (args) => {
    return (
      <MemoryRouter initialEntries={['/customers?username=K&name=C']}>
        <Routes>
          <Route path="customers" element={<ListPageWithRoute {...args} />} />
        </Routes>
      </MemoryRouter>
    );
  },
};
