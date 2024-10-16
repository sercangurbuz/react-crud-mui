import { Fragment, useState } from 'react';

import { Table as MuiTable, TableBody, TableHead, TablePagination, TableRow } from '@mui/material';
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  TableOptions,
  useReactTable,
  type RowData,
  type RowSelectionState,
} from '@tanstack/react-table';

import Scrollbar from '../scrollbar';
import { BodyTableCell } from './components/BodyTableCell';
import { BodyTableRow } from './components/BodyTableRow';
import { HeadTableCell } from './components/HeadTableCell';

/* -------------------------------------------------------------------------- */
/*                                    TYpes                                   */
/* -------------------------------------------------------------------------- */

export interface TableProps<TData extends RowData>
  extends Omit<TableOptions<TData>, 'getCoreRowModel'> {}

function Table<TData extends RowData>(props: TableProps<TData>) {
  /* -------------------------------------------------------------------------- */
  /*                                    Hooks                                   */
  /* -------------------------------------------------------------------------- */

  const table = useReactTable({
    ...props,
    // Row models
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    //getPaginationRowModel: getPaginationRowModel(),
  });

  const rowSelection = table.getState().rowSelection;

  return (
    <>
      <Scrollbar>
        <MuiTable>
          <TableHead>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                sx={{
                  '& .MuiTableCell-root': {
                    backgroundColor: 'background.header',
                  },
                }}
              >
                {headerGroup.headers.map((header) => (
                  <HeadTableCell key={header.id} sx={{ minWidth: header.getSize() }}>
                    {header.isPlaceholder ? null : (
                      <Fragment>
                        {/* GET HEADER COLUMN */}
                        {flexRender(header.column.columnDef.header, header.getContext())}
                      </Fragment>
                    )}
                  </HeadTableCell>
                ))}
              </TableRow>
            ))}
          </TableHead>

          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <BodyTableRow selected_row={rowSelection[row.id] ? 1 : 0} key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <BodyTableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </BodyTableCell>
                ))}
              </BodyTableRow>
            ))}
          </TableBody>
        </MuiTable>
      </Scrollbar>

      {/* TABLE PAGINATION SECTION */}
      <TablePagination
        component="div"
        rowsPerPageOptions={[5, 10, 25]}
        page={table.getState().pagination.pageIndex}
        rowsPerPage={table.getState().pagination.pageSize}
        count={table.getFilteredRowModel().rows.length}
        onPageChange={(_, page) => table.setPageIndex(page)}
        onRowsPerPageChange={(e) => table.setPageSize(+e.target.value || 5)}
      />
    </>
  );
}

export default Table;
