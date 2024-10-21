import { useState } from 'react';

import { InfoOutlined, LocationCityOutlined, Map, Phone } from '@mui/icons-material';
import { Card, Stack } from '@mui/material';
import { Meta, StoryObj } from '@storybook/react';
import { getSortedRowModel, SortingState } from '@tanstack/react-table';

import { FlexBox, FlexRowAlign } from '../../components/flexbox';
import User from '../../components/icons/User';
import UserAddIcon from '../../components/icons/UserAddIcon';
import Table, { TableProps } from '../../components/table/Table';
import mockData from '../../test-setup/mockUsers.json';
import { UserSchema } from '../utils/schema';

const meta: Meta<typeof Table> = {
  title: 'Components/Table',
  args: {
    data: mockData,
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
    ],
  },
  decorators: (Story) => {
    return (
      <Card>
        <Story />
      </Card>
    );
  },
  component: Table,
};

export default meta;
type TableStory = StoryObj<typeof Table>;

export const Simple: TableStory = {};

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
    enableNestedComponent: true,
    onRenderNestedComponent() {
      return <Table columns={meta.args!.columns!} data={meta.args!.data!} bordered />;
    },
  },
};
