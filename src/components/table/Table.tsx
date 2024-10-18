import React, { Fragment, useCallback, useEffect, useMemo, useRef } from 'react';
import { FieldValues, get, Path } from 'react-hook-form';
import { Link } from 'react-router-dom';

import { Add, ArrowDownward, ArrowUpward } from '@mui/icons-material';
import {
  Box,
  Checkbox,
  Table as MuiTable,
  Radio,
  Stack,
  SxProps,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Theme,
} from '@mui/material';
import {
  Cell,
  ColumnDef,
  flexRender,
  getCoreRowModel,
  Row,
  SortDirection,
  TableOptions,
  useReactTable,
  VisibilityState,
  type RowData,
} from '@tanstack/react-table';

import { FlexBox, FlexRowAlign } from '../flexbox';
import useTranslation from '../i18n/hooks/useTranslation';
import isNil from '../misc/isNil';
import Scrollbar from '../scrollbar';
import { ScrollbarProps } from '../scrollbar/Scrollbar';
import { isDark } from '../theme/theme.constants';
import { Tiny } from '../typography';
import { BodyTableCell } from './components/BodyTableCell';
import { BodyTableRow } from './components/BodyTableRow';
import EmptyText, { EmptyTextProps } from './components/EmptyText';
import { HeadTableCell } from './components/HeadTableCell';
import { NewRowButton } from './components/NewRowButton';
import { DEFAULT_ROW_KEY_FIELD, SELECTION_COL_NAME } from './constants';

/* -------------------------------------------------------------------------- */
/*                              Type Augmentation                             */
/* -------------------------------------------------------------------------- */

declare module '@tanstack/react-table' {
  interface Column<TData extends RowData, TValue = unknown> {
    link?: (row: Row<TData>) => string;
    align?: CellAlignment;
    title?: string;
  }
}

/* -------------------------------------------------------------------------- */
/*                                    Types                                   */
/* -------------------------------------------------------------------------- */

export type CellAlignment = 'center' | 'right' | 'left';

export type TableColumn<D extends object = object> = {
  sx?: SxProps<Theme>;
  hidden?: boolean;
  align?: CellAlignment;
  title?: string;
  disableSortBy?: boolean;
  link?: (row: Row<D>) => string;
} & ColumnDef<D>;

export interface TableProps<TData extends FieldValues>
  extends Omit<TableOptions<TData>, 'getCoreRowModel' | 'columns'>,
    Partial<Omit<EmptyTextProps, 'onChange'>> {
  rowIdField?: Path<TData>;
  descriptionField?: Path<TData>;
  columns: TableColumn<TData>[];
  autoFocus?: boolean;
  onRowClick?: (row: Row<TData>) => void;
  onRowEnterPress?: (row: Row<TData>) => void;
  scrollProps?: Partial<ScrollbarProps>;
  enableRowClickSelect?: boolean;
  showNewRowButton?: boolean;
  newRowButtonText?: string;
  onNewRow?: (row?: Row<TData>) => void;
  enableColorIndicator?: boolean;
  onIndicatorColor?: (row: Row<TData>) => string | undefined;
}

function Table<TData extends FieldValues>({
  enableSorting,
  rowIdField = DEFAULT_ROW_KEY_FIELD as Path<TData>,
  descriptionField,
  enableColorIndicator,
  onIndicatorColor,
  data,
  state,
  columns,
  onRowClick,
  onRowEnterPress,
  autoFocus,
  scrollProps,
  enableRowClickSelect,
  emptyText,
  showEmptyImage,
  showNewRowButton,
  newRowButtonText,
  onNewRow,
  ...tableProps
}: TableProps<TData>) {
  /* -------------------------------------------------------------------------- */
  /*                                    Hooks                                   */
  /* -------------------------------------------------------------------------- */

  const { t } = useTranslation();
  const bodyRef = useRef(null);
  const defaultData = useMemo(() => [], []);
  const extractRowId = useCallback(
    (row: TData) => String((row as FieldValues)[rowIdField]),
    [rowIdField],
  );

  /* -------------------------------------------------------------------------- */
  /*                                Table helpers                               */
  /* -------------------------------------------------------------------------- */

  /* ---------------------------- Column visibility --------------------------- */

  const columnVisibility = useMemo<VisibilityState>(() => {
    const ids = columns
      .filter((col) => !isNil(col.hidden))
      .reduce((result, col) => ({ [col.id!!]: !!col.hidden, ...result }), {});
    return ids;
  }, [columns]);

  /* --------------------------------- Columns -------------------------------- */

  const cols = useMemo<ColumnDef<TData>[]>(() => {
    if (tableProps.enableRowSelection) {
      return [
        {
          id: SELECTION_COL_NAME,
          enableSorting: false,
          maxSize: 50,
          header: ({ table }) => (
            <Checkbox
              {...{
                checked: table.getIsAllRowsSelected(),
                indeterminate: table.getIsSomeRowsSelected(),
                onChange: table.getToggleAllRowsSelectedHandler(),
              }}
            />
          ),
          cell: ({ row }) => {
            const isMultiSelect = row.getCanMultiSelect();
            return isMultiSelect ? (
              <Checkbox
                checked={row.getIsSelected()}
                disabled={!row.getCanSelect()}
                indeterminate={row.getIsSomeSelected()}
                onChange={row.getToggleSelectedHandler()}
              />
            ) : (
              <Radio
                disableRipple
                checked={row.getIsSelected()}
                onChange={row.getToggleSelectedHandler()}
              />
            );
          },
        },
        ...columns,
      ];
    }

    return columns;
  }, [columns, tableProps.enableRowSelection]);

  /* -------------------------------------------------------------------------- */
  /*                               Table instance                               */
  /* -------------------------------------------------------------------------- */

  const table = useReactTable({
    ...tableProps,
    columns: cols,
    state: {
      ...state,
      columnVisibility,
    },
    data: data ?? defaultData,
    getRowId: extractRowId,
    // Row models
    getCoreRowModel: getCoreRowModel(),
  });

  /* -------------------------------------------------------------------------- */
  /*                                   Events                                   */
  /* -------------------------------------------------------------------------- */

  useEffect(() => {
    if (autoFocus) {
      const rows = (bodyRef.current as unknown as HTMLBodyElement)?.children;
      if (rows && rows.length) {
        (rows[0] as HTMLElement).focus();
      }
    }
  }, [autoFocus]);

  const handleRowClick = (row: Row<TData>) => {
    if (enableRowClickSelect) {
      const isMultiSelect = row.getCanMultiSelect();

      if (isMultiSelect) {
        row.toggleSelected();
      } else {
        table.toggleAllRowsSelected(false);
        row.toggleSelected(true);
      }
    }
    onRowClick?.(row);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTableRowElement>, row: Row<TData>) => {
    event.stopPropagation();
    const currentRow = (bodyRef.current as unknown as HTMLBodyElement)?.children.namedItem(row.id);
    switch (event.key) {
      case 'ArrowUp':
        (currentRow?.previousElementSibling as HTMLTableRowElement)?.focus();
        break;
      case 'ArrowDown':
        (currentRow?.nextElementSibling as HTMLTableRowElement)?.focus();
        break;
      case 'Enter':
        onRowEnterPress?.(row);
        break;
      default:
        break;
    }
  };

  const handleNewRow = (row?: Row<TData>) => () => {
    onNewRow?.(row);
  };

  /* -------------------------------------------------------------------------- */
  /*                               Render Helpers                               */
  /* -------------------------------------------------------------------------- */

  const renderHeader = () => {
    return (
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
            {headerGroup.headers.map((header) => {
              const cellNode = flexRender(header.column.columnDef.header, header.getContext());
              const isSortingEnabled = header.column.getCanSort();
              const sortDirection = header.column.getIsSorted();
              const sortToggleHandler = header.column.getToggleSortingHandler();
              return (
                <HeadTableCell key={header.id} sx={{ minWidth: header.getSize() }}>
                  {isSortingEnabled ? (
                    <TableSortLabel
                      active={!!sortDirection}
                      onClick={sortToggleHandler}
                      direction={sortDirection === false ? undefined : sortDirection}
                    >
                      {cellNode}
                    </TableSortLabel>
                  ) : (
                    cellNode
                  )}
                </HeadTableCell>
              );
            })}
          </TableRow>
        ))}
      </TableHead>
    );
  };

  const renderCell = (cell: Cell<TData, unknown>) => {
    let cellNode = flexRender(cell.column.columnDef.cell, cell.getContext());

    if (cell.column.link) {
      const uri = cell.column.link(cell.row);
      if (uri) {
        cellNode = <Link to={uri}>{cellNode}</Link>;
      }
    }

    switch (cell.column.align) {
      case 'center':
        cellNode = <FlexRowAlign sx={{ textAlign: 'center' }}>{cellNode}</FlexRowAlign>;
        break;
      case 'right':
        cellNode = <FlexRowAlign>{cellNode}</FlexRowAlign>;
        break;
    }

    return (
      <BodyTableCell key={cell.id} title={cell.column.title}>
        {cellNode}
      </BodyTableCell>
    );
  };

  const renderEmptyImage = () => {
    const cols = table.getVisibleFlatColumns();
    return (
      <TableRow>
        <TableCell colSpan={cols?.length}>
          <EmptyText
            emptyText={emptyText ?? t('nodatafound')}
            showEmptyImage={showEmptyImage}
            sx={{ py: 2 }}
          />
        </TableCell>
      </TableRow>
    );
  };

  const renderDescriptionRow = (text: string, row: Row<TData>) => {
    const visibleCols = table.getVisibleFlatColumns();
    return (
      <BodyTableRow className="description-row" key={`description-${row.id}`}>
        {enableColorIndicator ? renderCell(row.getVisibleCells()[0]) : null}
        <TableCell
          sx={{
            paddingBottom: 2,
            paddingTop: 0,
            paddingLeft: 1,
            borderBottom: '1px solid',
            borderColor: (theme) => (isDark(theme) ? 'divider' : 'secondary.light'),
          }}
          colSpan={visibleCols?.length}
        >
          <Tiny
            color="common.white"
            sx={{
              borderRadius: 1,
              padding: '.2rem .8rem',
              backgroundColor: (theme) =>
                isDark(theme) ? theme.palette.grey[300] : theme.palette.grey[300],
            }}
          >
            {text}
          </Tiny>
        </TableCell>
      </BodyTableRow>
    );
  };

  const renderNewRow = (row?: Row<TData>) => {
    const cols = table.getVisibleFlatColumns();
    return (
      <TableRow key="new-row">
        <TableCell
          sx={{
            py: 2,
            textAlign: 'center',
            borderBottom: '1px solid',
            borderColor: (theme) => theme.palette.action.disabled,
          }}
          colSpan={cols?.length}
        >
          <NewRowButton disableRipple onClick={handleNewRow(row)}>
            <Stack flexDirection="row" alignItems="center" gap={0.5} p={0.4}>
              <Add sx={{ color: 'text.secondary', fontSize: '18px' }} />
              <Tiny color="text.secondary" fontWeight={600}>
                {newRowButtonText ?? t('new_row')}
              </Tiny>
            </Stack>
          </NewRowButton>
        </TableCell>
      </TableRow>
    );
  };

  const renderBody = () => {
    return (
      <TableBody ref={bodyRef}>
        {table.getRowModel().rows.map((row) => {
          const descriptionText = descriptionField ? get(row.original, descriptionField) : null;

          return (
            <Fragment>
              <BodyTableRow
                bordered={!descriptionText}
                isSelected={row.getIsSelected()}
                onClick={() => {
                  handleRowClick(row);
                }}
                sx={{
                  cursor: onRowClick || enableRowClickSelect ? 'pointer' : undefined,
                }}
                // for keyboard navigation
                id={row.id}
                tabIndex={0}
                onKeyDown={(e) => handleKeyDown(e, row)}
                key={row.id}
              >
                {row.getVisibleCells().map(renderCell)}
              </BodyTableRow>

              {descriptionText ? renderDescriptionRow(descriptionText, row) : null}
            </Fragment>
          );
        })}
        {!data?.length && renderEmptyImage()}
        {showNewRowButton && renderNewRow()}
      </TableBody>
    );
  };

  const renderPagination = () => {
    const { pageSize, pageIndex } = table.getState().pagination;

    return (
      <TablePagination
        component="div"
        rowsPerPageOptions={[5, 10, 25]}
        page={pageIndex}
        rowsPerPage={pageSize}
        count={table.getRowCount()}
        onPageChange={(_, page) => table.setPageIndex(page)}
        onRowsPerPageChange={(e) => table.setPageSize(+e.target.value || 5)}
      />
    );
  };

  return (
    <>
      <Scrollbar autoHide={false} forceVisible {...scrollProps}>
        <MuiTable>
          {renderHeader()}
          {renderBody()}
        </MuiTable>
      </Scrollbar>
      {renderPagination()}
    </>
  );
}

export default Table;
