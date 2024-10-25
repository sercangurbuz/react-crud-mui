import { useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { alpha, useTheme } from '@mui/material';

import Panel from '../../../components/panel/Panel';
import Table, { TableColumn } from '../../../components/table/Table';
import data from '../../../test-setup/mockUsers.json';
import { UserSchema } from '../../utils/schema';

function UserList() {
  const { pathname, search } = useLocation();
  const theme = useTheme();
  const cols = useMemo<TableColumn<UserSchema>[]>(
    () => [
      {
        accessorKey: 'id',
        align: 'center',
        maxSize: 15,
      },
      {
        accessorKey: 'username',
        header: 'User name',
        link(row) {
          return `/${row.original.id}`;
        },
      },
    ],
    [],
  );

  return (
    <Panel header="User List" helperText={`URL: ${pathname}${search}`}>
      <Table
        size="small"
        columns={cols}
        data={data}
        footerContent={<Link to="/new">New User</Link>}
        onRowProps={(row) =>
          `/${row.original.id}` === pathname
            ? { bgColor: alpha(theme.palette.primary.main, 0.1) }
            : undefined
        }
      />
    </Panel>
  );
}

export default UserList;
