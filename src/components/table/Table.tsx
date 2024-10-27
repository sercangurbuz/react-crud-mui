import React, { Fragment, ReactNode, useCallback, useEffect, useMemo, useRef } from 'react';
import { FieldValues, get, Path } from 'react-hook-form';
import { Link } from 'react-router-dom';

import { Add, KeyboardArrowDown, KeyboardArrowRight } from '@mui/icons-material';
import {
  alpha,
  Backdrop,
  Checkbox,
  CircularProgress,
  Table as MuiTable,
  TableProps as MuiTableProps,
  Radio,
  Skeleton,
  Stack,
  SxProps,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TablePagination,
  TablePaginationProps,
  TableRow,
  TableSortLabel,
  Theme,
  useTheme,
} from '@mui/material';
import {
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  useReactTable,
  type Cell,
  type ColumnDef,
  type CoreColumn,
  type Row,
  type RowData,
  type Table,
  type TableOptions,
  type VisibilityState,
} from '@tanstack/react-table';

import { FlexBox, FlexRowAlign } from '../flexbox';
import useTranslation from '../i18n/hooks/useTranslation';
import isNil from '../misc/isNil';
import Scrollbar from '../scrollbar';
import { ScrollbarProps } from '../scrollbar/Scrollbar';
import { primary } from '../theme/colors';
import { Small, Tiny } from '../typography';
import { BodyTableCell } from './components/BodyTableCell';
import { BodyTableRow } from './components/BodyTableRow';
import EmptyText, { EmptyTextProps } from './components/EmptyText';
import { ExpandMore } from './components/ExpandButton';
import { HeadTableCell } from './components/HeadTableCell';
import { NewRowButton } from './components/NewRowButton';
import { DEFAULT_ROW_KEY_FIELD, EXPANDER_COL_NAME, SELECTION_COL_NAME } from './constants';

/* -------------------------------------------------------------------------- */
/*                              Type Augmentation                             */
/* -------------------------------------------------------------------------- */

declare module '@tanstack/react-table' {
  interface CoreColumn<TData extends RowData, TValue = unknown> {
    link?: (row: Row<TData>) => string;
    align?: CellAlignment;
    title?: string;
    icon?: ReactNode;
  }
}

/* -------------------------------------------------------------------------- */
/*                                    Types                                   */
/* -------------------------------------------------------------------------- */

export type CellAlignment = 'center' | 'right' | 'left';
export interface RenderSubComponentProps<D extends object> {
  row: Row<D>;
}

export type TableColumn<D extends object = object> = {
  sx?: SxProps<Theme>;
  hidden?: boolean;
  align?: CellAlignment;
  title?: string;
  disableSortBy?: boolean;
  link?: (row: Row<D>) => string;
  icon?: ReactNode;
} & ColumnDef<D>;

export interface TableProps<TData extends FieldValues>
  extends Omit<TableOptions<TData>, 'getCoreRowModel' | 'columns'>,
    Partial<Pick<EmptyTextProps, 'emptyText' | 'showEmptyImage'>>,
    MuiTableProps {
  autoFocus?: boolean;
  bordered?: boolean;
  columns: TableColumn<TData>[];
  descriptionField?: Path<TData> | ((row: Row<TData>) => ReactNode);
  enableNestedComponent?: boolean | ((row: Row<TData>) => boolean | undefined);
  enablePaging?: boolean;
  enableSkeleton?: boolean;
  enableRowClickSelect?: boolean;
  footerContent?: ReactNode | ((table: Table<TData>) => ReactNode);
  loading?: boolean;
  newRowButtonText?: string;
  onNewRow?: () => void;
  onRenderNestedComponent?: (props: RenderSubComponentProps<TData>) => React.ReactNode;
  onRowClick?: (row: Row<TData>) => void;
  onRowEnterPress?: (row: Row<TData>) => void;
  onRowProps?: (row: Row<TData>) => React.ComponentProps<typeof BodyTableRow> | undefined;
  onSubTreeRows?: Path<TData> | ((originalRow: TData) => unknown[] | undefined);
  rowIdField?: Path<TData>;
  scrollProps?: Partial<ScrollbarProps>;
  showNewRowButton?: boolean;
  paginationProps?: Partial<TablePaginationProps>;
}

function isStandartColumn(colId: string) {
  return colId === EXPANDER_COL_NAME || colId === SELECTION_COL_NAME;
}

function Table<TData extends FieldValues>({
  autoFocus,
  bordered,
  columns,
  data,
  descriptionField,
  emptyText,
  enablePaging,
  enableRowClickSelect,
  enableNestedComponent,
  enableSkeleton = true,
  footerContent,
  loading,
  newRowButtonText,
  onNewRow,
  onRenderNestedComponent,
  onRowClick,
  onRowEnterPress,
  onRowProps,
  onSubTreeRows,
  paginationProps,
  rowIdField = DEFAULT_ROW_KEY_FIELD as Path<TData>,
  size = 'medium',
  stickyHeader = true,
  scrollProps,
  showEmptyImage,
  showNewRowButton,
  state,
  ...tableProps
}: TableProps<TData>) {
  /* -------------------------------------------------------------------------- */
  /*                                    Hooks                                   */
  /* -------------------------------------------------------------------------- */

  const { t } = useTranslation();
  const bodyRef = useRef(null);
  const firstLoadRef = useRef<boolean>(true);
  const defaultData = useMemo(() => [], []);
  const extractRowId = useCallback(
    (row: TData) => String((row as FieldValues)[rowIdField]),
    [rowIdField],
  );
  const theme = useTheme();

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
    let result = columns;
    if (tableProps.enableRowSelection) {
      result = [
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
        ...result,
      ];
    }

    if (enableNestedComponent || onSubTreeRows) {
      result = [
        {
          id: EXPANDER_COL_NAME,
          enableSorting: false,
          minSize: 50,
          size: 50,
          cell: ({ row }) => {
            const isExpanded = row.getIsExpanded();
            return row.getCanExpand() ? (
              <ExpandMore
                onClick={row.getToggleExpandedHandler()}
                expand={isExpanded}
                sx={{
                  p: 1,
                }}
              >
                {isExpanded ? (
                  <KeyboardArrowDown
                    color="disabled"
                    sx={{
                      color: 'primary.main',
                    }}
                  />
                ) : (
                  <KeyboardArrowRight color="disabled" />
                )}
              </ExpandMore>
            ) : null;
          },
        },
        ...result,
      ];
    }

    return result;
  }, [columns, tableProps.enableRowSelection]);

  /* ---------------------------- Expandable props ---------------------------- */

  /* -------------------------------------------------------------------------- */
  /*                               Table instance                               */
  /* -------------------------------------------------------------------------- */

  const table = useReactTable<TData>({
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
    // Row tree mode (sub rows)
    ...(onSubTreeRows
      ? {
          getSubRows: (originalRow) => {
            return typeof onSubTreeRows === 'string'
              ? get(originalRow, onSubTreeRows)
              : onSubTreeRows(originalRow);
          },
        }
      : undefined),
    // Row expanding
    ...(enableNestedComponent || onSubTreeRows
      ? {
          getExpandedRowModel: getExpandedRowModel(),
        }
      : undefined),
    // Row nested component
    ...(enableNestedComponent
      ? {
          getRowCanExpand(row) {
            return typeof enableNestedComponent === 'boolean'
              ? enableNestedComponent
              : !!enableNestedComponent(row);
          },
        }
      : undefined),
    // Column sizing
    defaultColumn: {
      minSize: 0,
      size: Number.MAX_SAFE_INTEGER,
      maxSize: Number.MAX_SAFE_INTEGER,
    },
  });

  useEffect(() => {
    if (autoFocus) {
      const rows = (bodyRef.current as unknown as HTMLBodyElement)?.children;
      if (rows && rows.length) {
        (rows[0] as HTMLElement).focus();
      }
    }
  }, [autoFocus]);

  useEffect(() => {
    if (data?.length) {
      firstLoadRef.current = false;
    }
  }, [data]);

  /* -------------------------------------------------------------------------- */
  /*                                   Events                                   */
  /* -------------------------------------------------------------------------- */

  const selectRow = (row: Row<TData>) => {
    const isRowSelectable = row.getCanSelect();

    if (!isRowSelectable) {
      return;
    }

    const isMultiSelect = row.getCanMultiSelect();

    if (isMultiSelect) {
      row.toggleSelected();
    } else {
      table.toggleAllRowsSelected(false);
      row.toggleSelected(true);
    }
  };

  const handleRowClick = (row: Row<TData>) => {
    if (enableRowClickSelect) {
      selectRow(row);
    }
    onRowClick?.(row);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTableRowElement>, row: Row<TData>) => {
    event.stopPropagation();
    const currentRow = (bodyRef.current as unknown as HTMLBodyElement)?.children.namedItem(row.id);
    switch (event.code) {
      case 'ArrowUp':
        (currentRow?.previousElementSibling as HTMLTableRowElement)?.focus();
        break;
      case 'ArrowDown':
        (currentRow?.nextElementSibling as HTMLTableRowElement)?.focus();
        break;
      case 'Space':
        selectRow(row);
        break;
      case 'Enter':
        onRowEnterPress?.(row);
        break;
      default:
        break;
    }
  };

  const handleNewRow = () => () => {
    onNewRow?.();
  };

  /* -------------------------------------------------------------------------- */
  /*                               Render Helpers                               */
  /* -------------------------------------------------------------------------- */

  const renderHeader = () => {
    const headerGroups = table.getHeaderGroups();
    const isBanded = headerGroups.length > 1;

    return (
      <TableHead>
        {headerGroups.map((headerGroup) => {
          const isLeafHeader = isBanded && headerGroups.length - 1 === headerGroup.depth;

          return (
            <TableRow
              key={headerGroup.id}
              sx={{
                '& .MuiTableCell-root': {
                  backgroundColor: 'background.header',
                  borderBottom: isBanded && !isLeafHeader ? '1px solid' : 'none',
                  borderColor: (theme) => theme.palette.grey[600],

                  '&:not(:first-child)': {
                    borderLeft: isBanded ? '1px solid' : 'none',
                    borderColor: (theme) => theme.palette.grey[600],
                  },
                },
              }}
            >
              {headerGroup.headers.map((header) => {
                const cellNode = flexRender(header.column.columnDef.header, header.getContext());
                const cellNodeWithIcon = header.column.icon ? (
                  <FlexRowAlign gap={1}>
                    {header.column.icon} {cellNode}
                  </FlexRowAlign>
                ) : (
                  cellNode
                );
                const isSortingEnabled = header.column.getCanSort();
                const sortDirection = header.column.getIsSorted();
                const sortToggleHandler = header.column.getToggleSortingHandler();

                return (
                  <HeadTableCell
                    key={header.id}
                    size={size}
                    colSpan={header.colSpan}
                    sx={{
                      ...(header.getSize() === Number.MAX_SAFE_INTEGER || !isLeafHeader
                        ? { width: 'auto' }
                        : {
                            width: header.getSize(),
                            minWidth: header.getSize(),
                          }),
                    }}
                  >
                    {isSortingEnabled ? (
                      <TableSortLabel
                        active={!!sortDirection}
                        onClick={sortToggleHandler}
                        direction={sortDirection === false ? undefined : sortDirection}
                      >
                        {cellNodeWithIcon}
                      </TableSortLabel>
                    ) : (
                      cellNodeWithIcon
                    )}
                  </HeadTableCell>
                );
              })}
            </TableRow>
          );
        })}
      </TableHead>
    );
  };

  const renderCell = (cell: Cell<TData, unknown>) => {
    let cellNode = flexRender(cell.column.columnDef.cell, cell.getContext());
    const isStandartCol = isStandartColumn(cell.column.id);
    const isIndentedCol = cell.row.depth > 0 && cell.column.getIndex() == 1;

    if ((cell.column.columnDef as CoreColumn<TData>).link) {
      const uri = (cell.column.columnDef as CoreColumn<TData>).link!(cell.row);
      if (uri) {
        cellNode = <Link to={uri}>{cellNode}</Link>;
      }
    }

    switch ((cell.column.columnDef as CoreColumn<TData>).align) {
      case 'center':
        cellNode = <FlexRowAlign sx={{ textAlign: 'center' }}>{cellNode}</FlexRowAlign>;
        break;
      case 'right':
        cellNode = <FlexBox justifyContent="flex-end">{cellNode}</FlexBox>;
        break;
    }

    return (
      <BodyTableCell
        key={cell.id}
        title={cell.column.title}
        size={isStandartCol ? 'small' : size}
        sx={{
          ...(cell.column.getSize() === Number.MAX_SAFE_INTEGER
            ? { width: 'auto' }
            : {
                width: cell.column.getSize(),
                minWidth: cell.column.getSize(),
              }),
          ...(isIndentedCol ? { paddingLeft: '3rem' } : undefined),
        }}
      >
        {cellNode}
      </BodyTableCell>
    );
  };

  const renderEmptyImage = () => {
    if (data?.length || loading) {
      return null;
    }

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
    const visibleCols = row.getVisibleCells();
    return (
      <BodyTableRow className="description-row" key={`description-${row.id}`}>
        <BodyTableCell
          colSpan={visibleCols?.length}
          sx={{ py: 1, px: 0, backgroundColor: alpha(primary.main, 0.1) }}
        >
          <Small color="text.secondary">{text}</Small>
        </BodyTableCell>
      </BodyTableRow>
    );
  };

  const renderNewRow = () => {
    if (!showNewRowButton || data?.length || loading) {
      return null;
    }

    const cols = table?.getVisibleFlatColumns();
    return (
      <TableRow key="new-row">
        <TableCell
          sx={{
            py: 2,
            textAlign: 'center',
          }}
          colSpan={cols?.length}
        >
          <NewRowButton disableRipple onClick={handleNewRow()}>
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
          let descriptionText;

          if (descriptionField) {
            descriptionText =
              typeof descriptionField === 'function'
                ? descriptionField(row)
                : get(row.original, descriptionField);
          }

          const isCanNested = onRenderNestedComponent && row.getIsExpanded();
          const isSelected = row.getIsSelected();
          const exRowProps = onRowProps?.(row);

          return (
            <Fragment key={row.id}>
              <BodyTableRow
                bordered={!descriptionText}
                indicatorColor={isSelected ? theme.palette.primary.main : undefined}
                bgColor={isSelected ? theme.palette.action.selected : undefined}
                onClick={() => {
                  handleRowClick(row);
                }}
                sx={{
                  cursor: onRowClick || enableRowClickSelect ? 'pointer' : undefined,
                }}
                {...exRowProps}
                // for keyboard navigation
                id={row.id}
                tabIndex={0}
                onKeyDown={(e) => handleKeyDown(e, row)}
                key={row.id}
              >
                {row.getVisibleCells().map(renderCell)}
              </BodyTableRow>

              {descriptionText ? renderDescriptionRow(descriptionText, row) : null}
              {isCanNested && renderNestedRow(row)}
            </Fragment>
          );
        })}
        {renderSkeleton()}
        {renderEmptyImage()}
        {renderNewRow()}
      </TableBody>
    );
  };

  const renderPagination = () => {
    if (!enablePaging) {
      return null;
    }

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
        {...paginationProps}
      />
    );
  };

  const renderProgress = () => {
    return (
      <Backdrop open={!!loading && !firstLoadRef.current} sx={{ position: 'absolute', zIndex: 2 }}>
        <CircularProgress />
      </Backdrop>
    );
  };

  const renderNestedRow = (row: Row<TData>) => {
    const nodes = onRenderNestedComponent?.({ row });
    const cells = row.getVisibleCells();

    return (
      <TableRow key={`sub-row-${row.id}`}>
        <TableCell
          sx={{
            py: '1rem',
            paddingLeft: 7,
            backgroundColor: 'background.default',
          }}
          colSpan={cells?.length}
        >
          {nodes}
        </TableCell>
      </TableRow>
    );
  };

  const renderFooter = () => {
    if (!footerContent) {
      return null;
    }
    const cols = table?.getVisibleFlatColumns();
    const node = typeof footerContent === 'function' ? footerContent(table) : footerContent;
    return (
      <TableFooter>
        <TableRow>
          <BodyTableCell size={size} colSpan={cols?.length}>
            {node}
          </BodyTableCell>
        </TableRow>
      </TableFooter>
    );
  };

  const renderSkeleton = (rowsNum: number = 10) => {
    if (!enableSkeleton || !loading || !firstLoadRef.current) {
      return null;
    }

    const cols = table.getVisibleFlatColumns();

    return [...Array(rowsNum)].map((_row, index) => (
      <TableRow key={index}>
        {cols.map((_, ind) => (
          <BodyTableCell scope="row" key={`skeloton-${ind}`}>
            <Skeleton animation="wave" variant="text" />
          </BodyTableCell>
        ))}
      </TableRow>
    ));
  };

  return (
    <>
      <Scrollbar autoHide={false} forceVisible {...scrollProps}>
        <MuiTable
          stickyHeader={stickyHeader}
          size={size}
          sx={{
            border: bordered ? '1px solid' : 'none',
            borderColor: (theme) => theme.palette.grey[700],
          }}
          {...tableProps}
        >
          {renderHeader()}
          {renderBody()}
          {renderFooter()}
        </MuiTable>
        {renderProgress()}
      </Scrollbar>
      {renderPagination()}
    </>
  );
}

export default Table;
