import { useState } from 'react';

import { InfoOutlined, LocationCityOutlined, Map, Phone } from '@mui/icons-material';
import { Card } from '@mui/material';
import { Meta, StoryObj } from '@storybook/react';
import { getSortedRowModel, RowSelectionState, SortingState } from '@tanstack/react-table';

import { FlexBox, FlexRowAlign } from '../../components/flexbox';
import User from '../../components/icons/User';
import Table, { TableColumn } from '../../components/table/Table';
import mockData from '../../test-setup/mockUsers.json';
import { UserSchema } from '../utils/schema';

const columns: TableColumn<UserSchema>[] = [
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
    header: 'EMail',
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
];

const meta: Meta<typeof Table<UserSchema>> = {
  title: 'Components/Table',
  args: {
    data: mockData as unknown as UserSchema[],
    columns,
  },
  decorators: (Story) => {
    return (
      <Card sx={{ borderRadius: 0 }}>
        <Story />
      </Card>
    );
  },
  component: Table,
};

export default meta;
type TableStory = StoryObj<typeof Table<UserSchema>>;

export const Simple: TableStory = {};

export const Loading: TableStory = {
  args: {
    loading: true,
  },
};

export const Empty: TableStory = {
  args: {
    data: [],
    emptyText: 'No items found.Please check your search filters',
  },
};

export const Creatable: TableStory = {
  args: {
    data: [],
    showEmptyImage: false,
    showNewRowButton: true,
    newRowButtonText: 'Create new user',
  },
};

export const Selection: TableStory = {
  args: {
    enableRowSelection: true,
  },
  render(args) {
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
    return <Table {...args} state={{ rowSelection }} onRowSelectionChange={setRowSelection} />;
  },
};

export const Dense: TableStory = {
  args: {
    size: 'small',
  },
};

export const CustomHeight: TableStory = {
  args: {
    scrollProps: {
      style: {
        maxHeight: 400,
      },
    },
  },
};

export const FixedWidth: TableStory = {
  args: {
    columns: columns!.map((item) => ({ ...item, size: 300 })),
    scrollProps: {
      style: {
        maxHeight: 400,
        maxWidth: 800,
      },
    },
  },
};

export const WithDescriptionRow: TableStory = {
  args: {
    descriptionField: (row) => (
      <FlexBox gap={1} alignItems="center">
        <Map sx={{ fontSize: '1rem' }} />
        {`${row.original.address?.street} ${row.original.address?.suite} ${row.original.address?.city} ${row.original.address?.zipcode}`}
      </FlexBox>
    ),
  },
};

export const HeaderGroup: TableStory = {
  args: {
    columns: [
      {
        id: 'main',
        header: () => (
          <FlexRowAlign gap={1}>
            <User /> User List
          </FlexRowAlign>
        ),
        columns: [
          {
            id: 'user',
            header: () => (
              <FlexRowAlign gap={1}>
                <InfoOutlined /> User Info
              </FlexRowAlign>
            ),
            columns: [
              {
                accessorKey: 'name',
                header: 'Name',
              },
              {
                accessorKey: 'username',
                header: 'User name',
              },
            ],
          },
          {
            id: 'contact',
            header: () => (
              <FlexRowAlign gap={1}>
                <Phone /> Contact
              </FlexRowAlign>
            ),
            columns: [
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
          },
          {
            id: 'address',
            header: () => (
              <FlexRowAlign gap={1}>
                <LocationCityOutlined /> Address
              </FlexRowAlign>
            ),
            columns: [
              {
                id: 'address',
                header: 'Address',
                enableSorting: false,
                accessorFn: (row) =>
                  `${row.address?.street} ${row.address?.suite} ${row.address?.city} ${row.address?.zipcode}`,
              },
            ],
          },
        ],
      },
    ],
  },
};

export const Sorting: TableStory = {
  args: {
    enableSorting: true,
  },
  render(args) {
    const [sorting, setsorting] = useState<SortingState>([{ id: 'username', desc: false }]);
    return (
      <Table
        {...args}
        state={{ sorting }}
        onSortingChange={setsorting}
        getSortedRowModel={getSortedRowModel()}
      />
    );
  },
};

export const WithNestedTable: TableStory = {
  args: {
    enableNestedComponent: (row) =>
      row.original.name?.startsWith('L') || row.original.name?.startsWith('C'),
    onRenderNestedComponent() {
      return (
        <Table
          columns={meta.args!.columns!}
          data={meta.args!.data!}
          bordered
          size="small"
          scrollProps={{ style: { maxHeight: 300 } }}
        />
      );
    },
  },
};

export const WithSubRows: TableStory = {
  args: {
    data: mockData.slice(0, 2) as unknown as UserSchema[],
    enableRowSelection: true,
    onSubTreeRows(originalRow) {
      return originalRow.id === 1
        ? mockData.slice(2, 5)
        : originalRow.id === 2
          ? mockData.slice(6, 10)
          : [];
    },
  },
};

export const CustomRow: TableStory = {
  args: {
    onRowProps(row) {
      return row.index % 2 === 0
        ? { bgColor: '#63091F', indicatorColor: '#EB194C' }
        : { bgColor: '#035058', indicatorColor: '#0C9E80' };
    },
  },
};
