/* eslint-disable react-hooks/rules-of-hooks */
import { useState } from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

import Assignment from '@mui/icons-material/Assignment';
import Close from '@mui/icons-material/Close';
import Done from '@mui/icons-material/Done';
import Pending from '@mui/icons-material/Pending';
import SaveAltOutlined from '@mui/icons-material/SaveAltOutlined';
import Search from '@mui/icons-material/Search';
import { Avatar, Box, Checkbox } from '@mui/material';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import { Meta, StoryObj } from '@storybook/react';
import { RowSelectionState } from '@tanstack/react-table';
import { z } from 'zod';

import ActionCommands from '../../components/action-commands/ActionCommands';
import { FlexBetween } from '../../components/flexbox';
import Email from '../../components/icons/Email';
import ListPage from '../../components/list-page/pages/ListPage';
import Table from '../../components/table/Table';
import { H1, Paragraph, Small } from '../../components/typography';
import { ServerError } from '../../components/utils';
import mockUsers from '../../test-setup/mockUsers.json';
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
    commandsProps: {
      create: { children: 'New User' },
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
          return <a href={`mailto:${props.getValue<string>()}`}>{props.renderValue() as string}</a>;
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
    defaultMeta: {
      pagination: { pageSize: 5 },
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

export const InitialLoadDisabled: ListPageStory = {
  args: {
    searchOnLoad: false,
  },
};

export const WithDefaultValues: StoryObj<
  typeof ListPage<{ username: string }, { username: string }>
> = {
  args: {
    alerts: [
      { type: 'info', message: 'Clear default filter to default values "M" => "K"' },
      { type: 'info', message: 'Meta has default values of pagination pageSize equals to 3' },
    ],
    enableClear: true,
    defaultFilter: { username: 'M' },
    defaultValues: { username: 'K' },
    defaultMeta: {
      pagination: {
        pageSize: 3,
      },
    },
  },
};

export const WithFunctionDefaultValues: StoryObj<
  typeof ListPage<{ username: string }, { username: string }>
> = {
  render(args) {
    return (
      <ListPage
        {...args}
        defaultValues={() => {
          return new Promise<{ username: string }>((resolve) => {
            setTimeout(() => {
              resolve({ username: 'B' });
            }, 2000);
          });
        }}
        onNeedData={(filter) => {
          console.log('onNeedData', filter);
        }}
      />
    );
  },
};

export const WithDefaultTableFilters: ListPageStory = {
  args: {
    enableClear: true,
    defaultMeta: {
      pagination: { pageSize: 3 },
      sorting: [
        {
          id: 'username',
          desc: false,
        },
      ],
    },
    tableProps: {
      paginationProps: {
        rowsPerPageOptions: [3, 5, 10, 25],
      },
    },
  },
};

export const WithNoFilter: ListPageStory = {
  args: {
    filterContent: undefined,
  },
};

export const WithCardList: ListPageStory = {
  args: {
    listType: 'card',
    onDetailPage(props) {
      return <EmbededDetailPage {...props} />;
    },
    enableActionCommands: true,
    cardProps: {
      onCardMeta(model, actions) {
        return (
          <Box
            sx={{
              p: 3,
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <FlexBetween mx={-1} mt={-1}>
              <Checkbox size="small" />
              {actions}
            </FlexBetween>

            <Stack direction="row" alignItems="center" py={2} spacing={2}>
              <Avatar src="/man.svg" sx={{ borderRadius: '20%' }} />

              <div>
                <Paragraph fontWeight={500}>{model.name}</Paragraph>
                <Small color="grey.500">{model.username}</Small>
              </div>
            </Stack>

            <Stack direction="row" alignItems="center" spacing={1}>
              <Email sx={{ color: 'grey.500', fontSize: 18 }} />
              <Small color="grey.500">{model.email}</Small>
            </Stack>
          </Box>
        );
      },
    },
  },
};

export const NoPaging: ListPageStory = {
  args: {
    enablePagination: false,
    defaultMeta: {
      pagination: {
        pageSize: 99,
      },
    },
  },
};

export const ClientPaging: ListPageStory = {
  args: {
    tableMode: 'client',
  },
  render(args) {
    const [data, setdata] = useState<typeof mockUsers>([]);
    const [loading, setloading] = useState<boolean>();
    return (
      <ListPage
        {...args}
        data={data}
        loading={loading}
        onNeedData={() => {
          setloading(true);
          setTimeout(() => {
            setloading(false);
            setdata(mockUsers);
          }, 2000);
        }}
      />
    );
  },
};

export const WithChildren: ListPageStory = {
  args: {
    children: <H1>this is children</H1>,
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

export const UseListPageHook: ListPageStory = {
  args: {
    filterContent: <FilterContent useHook />,
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
  args: {
    style: { marginBottom: 5 },
  },
  render: (args, { id }) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [defaultFilters, setValue] = useSession<any>({
      name: id,
      defaultValue: { defaultMeta: { sorting: [{ id: 'username' }] } },
    });
    const [mounted, setMounted] = useState(true);

    return (
      <Stack>
        <Button sx={{ width: 200 }} onClick={() => setMounted((p) => !p)}>
          {!mounted ? 'MOUNT' : 'UNMOUNT'}
        </Button>

        <Alert sx={{ borderRadius: 0, my: 2 }}>
          <AlertTitle>Stored Filters (filter and meta)</AlertTitle>
          {defaultFilters && JSON.stringify(defaultFilters)}
        </Alert>

        {mounted ? (
          <ListPage
            {...args}
            onNeedData={(filter, meta) => {
              setValue({ defaultFilter: filter, defaultMeta: meta });
              args.onNeedData?.(filter, meta);
            }}
            {...defaultFilters}
          />
        ) : null}
      </Stack>
    );
  },
};

export const WithDetailPage: ListPageStory = {
  args: {
    enableCreateItem: true,
    enableActionCommands: true,
    onDetailPage: (props) => <EmbededDetailPage {...props} />,
    commandsProps: {
      create: { children: 'New User' },
    },
    onActionClick(reason) {
      alert(`Fallback event for reason ${reason}`);
    },
    onActionCommands(props) {
      return (
        <ActionCommands {...props} showCopy={false}>
          {(close) => (
            <>
              <Divider />
              <Table.MoreMenuItem
                title="Custom Menu"
                Icon={SaveAltOutlined}
                onClick={() => close()}
              />
            </>
          )}
        </ActionCommands>
      );
    },
  },
};

export const WithDetailPagesByReason: ListPageStory = {
  args: {
    enableCreateItem: true,
    enableActionCommands: true,
    onDetailPage: {
      fetch: (props) => <EmbededDetailPage {...props} />,
      create: (props) => <EmbededDrawerDetailPage {...props} />,
    },
    onActionClick(reason) {
      alert(`Fallback event for reason ${reason}`);
    },
    commandsProps: {
      create: { children: 'New User' },
    },
  },
};

export const WithRowClickToDetails: ListPageStory = {
  ...WithDetailPagesByReason,
  args: {
    ...WithDetailPagesByReason.args,
    enableRowClickToDetails: 'fetch',
  },
};

export const WithDetailPageDrawer: ListPageStory = {
  name: 'With DetailPage (Drawer)',
  args: {
    enableCreateItem: true,
    enableActionCommands: true,
    onDetailPage: (props) => <EmbededDrawerDetailPage {...props} />,
    commandsProps: {
      create: { children: 'New User' },
    },
  },
};

export const MultiSelection: ListPageSelectionStory = {
  args: {},
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
    enableSearch: true,
    enableCreateItem: true,
    enableClear: true,
    onCommands(props) {
      return (
        <>
          <Button color="warning">Extra Command 1</Button>
          <Button color="success">Extra Command 2</Button>
          <ListPage.Commands {...props} />
        </>
      );
    },
  },
};

export const AutoSearch: ListPageStory = {
  name: 'AutoSearch Mode',
  args: {
    autoSearch: true,
    enableClear: true,
  },
};

export const FilterFromQuerystring: ListPageRouteStory = {
  args: {
    enableQueryStringFilter: { username: true },
    enableClear: true,
    defaultMeta: {
      sorting: [{ id: 'name', desc: true }],
    },
    tabs: [
      {
        key: 'tab1',
        value: 'tab1',
        label: 'Tab 1',
      },
      {
        key: 'tab2',
        value: 'tab2',
        label: 'Tab 2',
      },
      {
        key: 'tab3',
        value: 'tab3',
        label: 'Tab 3',
      },
    ],
    enableCreateItem: true,
    onDetailPage: (props) => <EmbededDetailPage {...props} />,
  },
  render: (args) => {
    return (
      <MemoryRouter initialEntries={['/customers']}>
        <Routes>
          <Route path="customers" element={<ListPageWithRoute {...args} />} />
        </Routes>
      </MemoryRouter>
    );
  },
};

export const WithRoutedDetailPage: ListPageStory = {
  args: {
    enableCreateItem: true,
    onDetailPage: {
      fetch: (props) => <EmbededDetailPage {...props} />,
    },
    commandsProps: {
      create: { children: 'New User' },
    },
    enableActionCommands: true,
  },
  render: (args) => {
    return (
      <MemoryRouter initialEntries={['/customers']}>
        <Routes>
          <Route path="customers">
            <Route index element={<ListPageWithRoute {...args} />} />
            <Route path=":id" element={<h1>Create Detail Page</h1>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );
  },
};
