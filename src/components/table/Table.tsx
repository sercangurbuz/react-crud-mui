import React, { Fragment, ReactNode, useCallback, useEffect, useMemo, useRef } from 'react';
import { FieldValues, get, Path } from 'react-hook-form';
import { Link } from 'react-router-dom';

import Add from '@mui/icons-material/Add';
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import Backdrop from '@mui/material/Backdrop';
import Checkbox from '@mui/material/Checkbox';
import CircularProgress from '@mui/material/CircularProgress';
import Radio from '@mui/material/Radio';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import { alpha, SxProps, Theme, useTheme } from '@mui/material/styles';
import MuiTable, { TableProps as MuiTableProps } from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableFooter from '@mui/material/TableFooter';
import TableHead from '@mui/material/TableHead';
import TablePagination, { TablePaginationProps } from '@mui/material/TablePagination';
import TableRow, { TableRowProps } from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import {
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  Header,
  useReactTable,
  type Cell,
  type ColumnDef,
  type CoreColumn,
  type Row,
  type RowData,
  type TableOptions,
  type Table as TableType,
  type VisibilityState,
} from '@tanstack/react-table';

import { FlexBetween, FlexBox, FlexRowAlign } from '../flexbox';
import { SpinDelayOptions, useSpinDelay } from '../hooks/useSpinDelay';
import useTranslation from '../i18n/hooks/useTranslation';
import { reactNodeToString } from '../misc';
import isNil from '../misc/isNil';
import Scrollbar from '../scrollbar';
import { ScrollbarProps } from '../scrollbar/Scrollbar';
import { isDark } from '../theme/theme.constants';
import { Small } from '../typography';
import { BodyTableCell } from './components/BodyTableCell';
import { BodyTableRow } from './components/BodyTableRow';
import EmptyText, { EmptyTextProps } from './components/EmptyText';
import { ExpandMore } from './components/ExpandButton';
import { HeadTableCell } from './components/HeadTableCell';
import { NewRowButton } from './components/NewRowButton';
import TableMoreMenu from './components/TableMoreMenu';
import TableMoreMenuItem from './components/TableMoreMenuItem';
import {
  DEFAULT_PAGER_SIZES,
  DEFAULT_ROW_KEY_FIELD,
  EXPANDER_COL_NAME,
  SELECTION_COL_NAME,
} from './constants';
import { getPinningStyles } from './utils/getPinningStyle';

/* -------------------------------------------------------------------------- */
/*                              Type Augmentation                             */
/* -------------------------------------------------------------------------- */

declare module '@tanstack/react-table' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface CoreColumn<TData extends RowData, TValue = unknown> {
    link?: (row: Row<TData>) => string;
    align?: CellAlignment;
    title?: string;
    icon?: ReactNode;
    export?: boolean;
    ellipsis?: boolean;
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
  export?: boolean;
  ellipsis?: boolean;
} & ColumnDef<D>;

export interface TableProps<TData extends FieldValues>
  extends Omit<TableOptions<TData>, 'getCoreRowModel' | 'columns'>,
    Partial<Pick<EmptyTextProps, 'emptyText' | 'showEmptyImage' | 'emptyImageUrl'>>,
    Pick<MuiTableProps, 'size' | 'stickyHeader' | 'sx'> {
  autoFocus?: boolean;
  bordered?: boolean;
  columns: TableColumn<TData>[];
  descriptionField?: Path<TData> | ((row: Row<TData>) => ReactNode);
  enableNestedComponent?: boolean | ((row: Row<TData>) => boolean | undefined);
  enablePagination?: boolean;
  enableSkeleton?: boolean;
  enableRowClickSelect?: boolean;
  loading?: boolean;
  newRowButtonText?: ReactNode;
  onNewRow?: () => void;
  onRenderNestedComponent?: (props: RenderSubComponentProps<TData>) => React.ReactNode;
  onRowClick?: (e: React.MouseEvent<HTMLTableRowElement>, row: Row<TData>) => void;
  onRowEnterPress?: (row: Row<TData>) => void;
  onRowProps?: (
    row: Row<TData>,
    table: TableType<TData>,
  ) => React.ComponentProps<typeof BodyTableRow> | undefined;
  onCellProps?: (
    cell: Cell<TData, unknown>,
    table: TableType<TData>,
  ) => React.ComponentProps<typeof BodyTableCell> | undefined;
  onHeadCellProps?: (
    header: Header<TData, unknown>,
    table: TableType<TData>,
  ) => React.ComponentProps<typeof HeadTableCell> | undefined;
  onFooterCellProps?: (
    header: Header<TData, unknown>,
    table: TableType<TData>,
  ) => React.ComponentProps<typeof BodyTableCell> | undefined;
  onSubTreeRows?: Path<TData> | ((originalRow: TData) => unknown[] | undefined);
  rowIdField?: Path<TData>;
  scrollProps?: Partial<ScrollbarProps>;
  skeletonRows?: number;
  showNewRowButton?: 'always' | 'empty';
  showEmptyText?: boolean;
  showHeader?: boolean;
  showFooter?: boolean;
  paginationProps?: Partial<TablePaginationProps> & { extraContent?: ReactNode };
  headerSx?: TableRowProps['sx'];
  rowSx?: TableRowProps['sx'];
  newRowButtonContent?: ReactNode;
  alternateColor?: boolean;
  delayOptions?: SpinDelayOptions;
}

const DEFAULT_SKELETON_ROW_NUMBER = 10;
function isStandartColumn(colId: string) {
  return colId === EXPANDER_COL_NAME || colId === SELECTION_COL_NAME;
}

function Table<TData extends FieldValues>({
  alternateColor,
  autoFocus,
  bordered,
  columns,
  data,
  delayOptions,
  descriptionField,
  emptyText,
  enablePagination,
  enableRowClickSelect,
  enableNestedComponent,
  enableSkeleton = true,
  headerSx,
  loading,
  newRowButtonText,
  newRowButtonContent,
  onCellProps,
  onFooterCellProps,
  onHeadCellProps,
  onNewRow,
  onRenderNestedComponent,
  onRowClick,
  onRowEnterPress,
  onRowProps,
  onSubTreeRows,
  paginationProps,
  rowIdField = DEFAULT_ROW_KEY_FIELD as Path<TData>,
  rowSx,
  size = 'medium',
  showEmptyText = true,
  showHeader = true,
  showFooter,
  stickyHeader = true,
  scrollProps,
  showEmptyImage,
  showNewRowButton,
  skeletonRows = DEFAULT_SKELETON_ROW_NUMBER,
  state,
  sx,
  ...tableProps
}: TableProps<TData>) {
  /* -------------------------------------------------------------------------- */
  /*                                    Hooks                                   */
  /* -------------------------------------------------------------------------- */

  const { t } = useTranslation();
  const bodyRef = useRef(null);
  const firstLoadRef = useRef<boolean>(true);
  const defaultData = useMemo(() => [], []);
  const extractRowId = useCallback((row: TData) => get(row, rowIdField), [rowIdField]);
  const theme = useTheme();
  const { isLoading: isDebouncedLoading, state: loadingState } = useSpinDelay(
    !!loading,
    delayOptions,
  );

  /* -------------------------------------------------------------------------- */
  /*                                Table helpers                               */
  /* -------------------------------------------------------------------------- */

  /* ---------------------------- Column visibility --------------------------- */

  const columnVisibility = useMemo<VisibilityState>(() => {
    const ids = columns
      .filter((col) => !isNil(col.hidden))
      .reduce((result, col) => ({ [col.id!]: !col.hidden, ...result }), {});
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
          header: ({ table }) =>
            table.options.enableMultiRowSelection ? (
              <Checkbox
                size={size}
                {...{
                  checked: table.getIsAllRowsSelected(),
                  indeterminate: table.getIsSomeRowsSelected(),
                  onChange: table.getToggleAllRowsSelectedHandler(),
                }}
              />
            ) : null,
          cell: ({ row }) => {
            const isMultiSelect = row.getCanMultiSelect();
            return isMultiSelect ? (
              <Checkbox
                size={size}
                checked={row.getIsSelected()}
                disabled={!row.getCanSelect()}
                indeterminate={row.getIsSomeSelected()}
                onChange={row.getToggleSelectedHandler()}
              />
            ) : (
              <Radio
                size={size}
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
                  <KeyboardArrowRight sx={{ color: 'grey.400' }} />
                )}
              </ExpandMore>
            ) : null;
          },
        },
        ...result,
      ];
    }

    return result;
  }, [columns, enableNestedComponent, onSubTreeRows, size, tableProps.enableRowSelection]);

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
            return (
              typeof onSubTreeRows === 'string'
                ? get(originalRow, onSubTreeRows)
                : onSubTreeRows(originalRow)
            ) as TData[];
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
      //for skeleton render
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

  const handleRowClick = (e: React.MouseEvent<HTMLTableRowElement>, row: Row<TData>) => {
    if (enableRowClickSelect) {
      selectRow(row);
    }
    onRowClick?.(e, row);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTableRowElement>, row: Row<TData>) => {
    const currentRow = (bodyRef.current as unknown as HTMLBodyElement)?.children.namedItem(row.id);
    switch (event.code) {
      case 'ArrowUp':
        (currentRow?.previousElementSibling as HTMLTableRowElement)?.focus();
        event.stopPropagation();
        break;
      case 'ArrowDown':
        (currentRow?.nextElementSibling as HTMLTableRowElement)?.focus();
        event.stopPropagation();
        break;
      case 'Space':
        selectRow(row);
        event.stopPropagation();
        break;
      case 'Enter':
        onRowEnterPress?.(row);
        event.stopPropagation();
        break;
    }
  };

  /* -------------------------------------------------------------------------- */
  /*                               Render Helpers                               */
  /* -------------------------------------------------------------------------- */

  const renderHeaderCell = (header: Header<TData, unknown>, isLeafHeader: boolean) => {
    const cellNode = (
      <FlexRowAlign gap={1} sx={{ textAlign: 'center' }}>
        {header.column.icon}
        {flexRender(header.column.columnDef.header, header.getContext())}
      </FlexRowAlign>
    );

    const pinningStyles = table.options.enableColumnPinning
      ? getPinningStyles(header.column)
      : null;
    const isSortingEnabled = header.column.getCanSort();
    const sortDirection = header.column.getIsSorted();
    const sortToggleHandler = header.column.getToggleSortingHandler();
    const isSortingActive = !!sortDirection;
    const exHeadCellProps = onHeadCellProps?.(header, table);

    return (
      <HeadTableCell
        key={header.id}
        size={size}
        colSpan={header.colSpan}
        style={{ ...pinningStyles }}
        {...exHeadCellProps}
        sx={{
          textAlign: 'center',
          backgroundColor: isSortingActive
            ? alpha(theme.palette.primary.main, 0.1)
            : 'background.header',
          ...(header.getSize() === Number.MAX_SAFE_INTEGER || !isLeafHeader
            ? { width: 'auto' }
            : {
                width: header.getSize(),
                minWidth: header.getSize(),
              }),
          ...exHeadCellProps?.sx,
        }}
      >
        {isSortingEnabled ? (
          <TableSortLabel
            active={isSortingActive}
            onClick={sortToggleHandler}
            direction={sortDirection === false ? undefined : sortDirection}
            sx={{
              '&.Mui-active, &.MuiTableSortLabel-root >.MuiTableSortLabel-icon': {
                color: isSortingActive ? 'primary.main' : undefined,
              },
            }}
          >
            {cellNode}
          </TableSortLabel>
        ) : (
          cellNode
        )}
      </HeadTableCell>
    );
  };

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
                  borderBottom: isBanded && !isLeafHeader ? '1px solid' : 'none',
                  borderColor: (theme) =>
                    isDark(theme) ? theme.palette.grey[600] : theme.palette.grey[200],

                  '&:not(:first-child)': {
                    borderLeft: isBanded ? '1px solid' : 'none',
                    borderColor: (theme) =>
                      isDark(theme) ? theme.palette.grey[600] : theme.palette.grey[200],
                  },
                },
                ...headerSx,
              }}
            >
              {headerGroup.headers.map((header) => renderHeaderCell(header, isLeafHeader))}
            </TableRow>
          );
        })}
      </TableHead>
    );
  };

  const renderCell = (cell: Cell<TData, unknown>) => {
    let cellNode = flexRender(cell.column.columnDef.cell, cell.getContext());
    const isStandartCol = isStandartColumn(cell.column.id);
    const isIndentedCol = cell.row.depth > 0 && cell.column.getIndex() === 1;
    const isSortingActive = cell.column.getCanSort() && !!cell.column.getIsSorted();
    const pinningStyles = table.options.enableColumnPinning ? getPinningStyles(cell.column) : null;
    const isEllipsis = (cell.column.columnDef as CoreColumn<TData>).ellipsis;
    const exCellProps = onCellProps?.(cell, table);

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
        title={cell.column.title || (isEllipsis ? cell.getValue<string>() : undefined)}
        size={isStandartCol ? 'small' : size}
        style={{ ...pinningStyles }}
        ellipsis={isEllipsis}
        {...exCellProps}
        sx={{
          backgroundColor: isSortingActive
            ? isDark(theme)
              ? alpha(theme.palette.primary.main, 0.04)
              : alpha(theme.palette.primary.main, 0.07)
            : undefined,
          ...(cell.column.getSize() === Number.MAX_SAFE_INTEGER
            ? { width: 'auto' }
            : {
                width: cell.column.getSize(),
                minWidth: cell.column.getSize(),
                maxWidth: cell.column.columnDef.maxSize,
              }),
          ...(isIndentedCol ? { paddingLeft: '3rem' } : undefined),
          ...exCellProps?.sx,
        }}
      >
        {cellNode}
      </BodyTableCell>
    );
  };

  const renderEmptyImage = () => {
    if (data?.length || loading || !showEmptyText) {
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

  const renderDescriptionRow = (text: string, row: Row<TData>, sx: TableRowProps['sx']) => {
    const visibleCols = row.getVisibleCells();
    return (
      <BodyTableRow className="description-row" key={`description-${row.id}`} sx={sx}>
        <BodyTableCell
          colSpan={visibleCols?.length}
          title={reactNodeToString(text)}
          size={size}
          ellipsis
          sx={{ pt: 0 }}
        >
          <Small color="text.secondary">{text}</Small>
        </BodyTableCell>
      </BodyTableRow>
    );
  };

  const renderNewRow = () => {
    if (!showNewRowButton || loading) {
      return null;
    }

    if (typeof showNewRowButton === 'string' && showNewRowButton === 'empty' && data?.length) {
      return null;
    }

    const newRowContent = newRowButtonContent ?? (
      <NewRowButton disableRipple onClick={onNewRow}>
        <Stack flexDirection="row" alignItems="center" gap={0.5} p={0.4}>
          <Add sx={{ fontSize: '14px' }} />
          {newRowButtonText ?? t('new_row')}
        </Stack>
      </NewRowButton>
    );

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
          {newRowContent}
        </TableCell>
      </TableRow>
    );
  };

  const renderBodyRows = () => {
    const rows = table.getRowModel().rows;
    const rowNodes = rows.map((row) => {
      let descriptionText;

      if (descriptionField) {
        descriptionText = (
          typeof descriptionField === 'function'
            ? descriptionField(row)
            : get(row.original, descriptionField)
        ) as string;
      }

      const isCanNested = onRenderNestedComponent && row.getIsExpanded();
      const isSelected = row.getIsSelected();
      const exRowProps = onRowProps?.(row, table);

      return (
        <Fragment key={row.id}>
          <BodyTableRow
            bordered={!descriptionText}
            indicatorColor={isSelected ? theme.palette.primary.main : undefined}
            bgColor={
              isSelected
                ? `${alpha(theme.palette.primary.main, 0.3)} !important`
                : alternateColor && row.index % 2
                  ? theme.palette.action.hover
                  : undefined
            }
            onClick={(e) => {
              handleRowClick(e, row);
            }}
            {...exRowProps}
            sx={
              {
                ...rowSx,
                ...exRowProps?.sx,
                cursor: onRowClick || enableRowClickSelect ? 'pointer' : 'default',
                wordWrap: 'break-word',
                wordBreak: 'break-all',
              } as TableRowProps['sx']
            }
            // for keyboard navigation
            id={row.id}
            tabIndex={0}
            onKeyDown={(e) => {
              handleKeyDown(e, row);
              exRowProps?.onKeyDown?.(e);
            }}
            key={row.id}
          >
            {row.getVisibleCells().map(renderCell)}
          </BodyTableRow>

          {descriptionText
            ? renderDescriptionRow(descriptionText, row, {
                ...rowSx,
                ...exRowProps?.sx,
              } as TableRowProps['sx'])
            : null}
          {isCanNested && renderNestedRow(row)}
        </Fragment>
      );
    });

    return rowNodes;
  };

  const renderBody = () => {
    return (
      <TableBody ref={bodyRef}>
        {renderBodyRows()}
        {renderSkeleton(skeletonRows)}
        {renderEmptyImage()}
        {renderNewRow()}
      </TableBody>
    );
  };

  const renderPagination = () => {
    if (!enablePagination) {
      return null;
    }

    const { pageSize, pageIndex } = table.getState().pagination;

    const pager = (
      <TablePagination
        component="div"
        rowsPerPageOptions={DEFAULT_PAGER_SIZES}
        page={pageIndex}
        rowsPerPage={pageSize}
        count={table.getRowCount()}
        onPageChange={(_, page) => table.setPageIndex(page)}
        onRowsPerPageChange={(e) => table.setPageSize(+e.target.value || 5)}
        {...paginationProps}
      />
    );

    if (paginationProps?.extraContent) {
      return (
        <FlexBetween sx={{ pl: 1 }}>
          {paginationProps.extraContent}
          {pager}
        </FlexBetween>
      );
    }

    return pager;
  };

  const renderProgress = () => {
    return (
      <Backdrop
        open={!!isDebouncedLoading && !firstLoadRef.current}
        sx={{ position: 'absolute', zIndex: 2 }}
      >
        <CircularProgress sx={{ color: loadingState === 'TOO_LONG' ? 'error.main' : undefined }} />
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
            backgroundColor: alpha(theme.palette.primary.main, 0.05),
          }}
          colSpan={cells?.length}
        >
          {nodes}
        </TableCell>
      </TableRow>
    );
  };

  const renderFooter = () => {
    if (!showFooter) {
      return null;
    }

    return (
      <TableFooter>
        {table.getFooterGroups().map((footerGroup) => (
          <TableRow
            key={footerGroup.id}
            sx={{ backgroundColor: alpha(theme.palette.primary.main, 0.05) }}
          >
            {footerGroup.headers.map((header) => {
              const exFooterCellProps = onFooterCellProps?.(header, table);

              return (
                <BodyTableCell
                  size={size}
                  key={header.id}
                  colSpan={header.colSpan}
                  {...exFooterCellProps}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.footer, header.getContext())}
                </BodyTableCell>
              );
            })}
          </TableRow>
        ))}
      </TableFooter>
    );
  };

  const renderSkeleton = (rowsNum: number) => {
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
            borderColor: (theme) => theme.palette.grey[200],
            ...theme.applyStyles('dark', {
              borderColor: theme.palette.grey[700],
            }),
            borderCollapse: 'separate',
            borderSpacing: 0,
            ...sx,
          }}
        >
          {showHeader ? renderHeader() : null}
          {renderBody()}
          {renderFooter()}
        </MuiTable>
        {renderProgress()}
      </Scrollbar>
      {renderPagination()}
    </>
  );
}

Table.MoreMenu = TableMoreMenu;
Table.MoreMenuItem = TableMoreMenuItem;
Table.Row = BodyTableRow;
Table.Cell = BodyTableCell;
Table.HeadCell = HeadTableCell;
Table.NewRowButton = NewRowButton;

export default Table;
