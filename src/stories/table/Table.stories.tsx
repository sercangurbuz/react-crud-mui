/* eslint-disable react-hooks/rules-of-hooks */
import { useState } from 'react';
import { MemoryRouter } from 'react-router-dom';

import InfoOutlined from '@mui/icons-material/InfoOutlined';
import LocationCityOutlined from '@mui/icons-material/LocationCityOutlined';
import Map from '@mui/icons-material/Map';
import Phone from '@mui/icons-material/Phone';
import Card from '@mui/material/Card';
import { alpha } from '@mui/material/styles';
import { Meta, StoryObj } from '@storybook/react';
import { getSortedRowModel, RowSelectionState, SortingState } from '@tanstack/react-table';

import { FlexBox, FlexRowAlign } from '../../components/flexbox';
import User from '../../components/icons/User';
import Table, { TableColumn } from '../../components/table/Table';
import mockData from '../../test-setup/mockUsers.json';
import { UserSchema } from '../utils/schema';

export const columns: TableColumn<UserSchema>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    footer: () => 'this is footer content',
  },
  {
    accessorKey: 'username',
    header: 'User name',
  },
  {
    accessorKey: 'email',
    header: 'EMail',
    cell(props) {
      return <a href={`mailto:${props.getValue() as string}`}>{props.renderValue() as string}</a>;
    },
    footer: () => 'this is footer content',
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

export const HiddenColumns: TableStory = {
  args: {
    columns: [
      {
        id: 'name',
        header: 'This is hidden column',
        hidden: true,
      },
      ...columns.slice(1),
    ],
  },
};

export const Ellipsis: TableStory = {
  args: {
    columns: columns.map((item) => ({
      ...item,
      ellipsis: true,
      maxSize: 150,
    })),
  },
};

export const WithSkeleton: TableStory = {
  args: {
    loading: true,
    data: undefined,
  },
};

export const WithNoHeader: TableStory = {
  args: {
    showHeader: false,
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

export const AlternateColor: TableStory = {
  args: {
    alternateColor: true,
  },
};

export const Selection: TableStory = {
  args: {
    enableRowSelection: true,
    alternateColor: true,
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
    columns: columns.map((item) => ({ ...item, size: 200 })),
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
    onRowProps(row) {
      return {
        indicatorColor: row.index % 2 === 0 ? '#035058' : '#0C9E80',
      };
    },
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

export const Alignment: TableStory = {
  args: {
    columns: columns.map((col, index) => ({
      ...col,
      align: index === 0 ? 'center' : index === 1 ? 'right' : 'left',
    })),
  },
};

export const WithLink: TableStory = {
  decorators: (Story) => (
    <MemoryRouter>
      <Story />
    </MemoryRouter>
  ),
  args: {
    columns: [
      {
        accessorKey: 'name',
        header: 'Name with link',
        link(row) {
          return `/${row.original.id}`;
        },
      },
      ...columns.slice(1),
    ],
  },
};

export const WithNestedTable: TableStory = {
  args: {
    enableNestedComponent: (row) =>
      row.original.name?.startsWith('L') || row.original.name?.startsWith('C'),
    onRenderNestedComponent() {
      return (
        <Card>
          <Table
            columns={meta.args!.columns!}
            data={meta.args!.data!}
            bordered
            size="small"
            scrollProps={{ style: { maxHeight: 300 } }}
          />
        </Card>
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
        ? { bgColor: alpha('#EB194C', 0.1), indicatorColor: '#EB194C' }
        : { bgColor: alpha('#0C9E80', 0.1), indicatorColor: '#0C9E80' };
    },
  },
};

export const Footer: TableStory = {
  args: {
    size: 'small',
    showFooter: true,
  },
};

export const Pinning: TableStory = {
  args: {
    size: 'small',
    columns: columns.map((item) => ({ ...item, size: 300 })),
    enableColumnPinning: true,
    initialState: {
      columnPinning: {
        left: ['name', 'username'],
      },
    },
  },
};
