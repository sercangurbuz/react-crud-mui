import { useState } from 'react';
import { DeepPartial, FieldValues } from 'react-hook-form';

import { RowSelectionState, TableState } from '@tanstack/react-table';

import { UseFormReturn } from '../../form/hooks/useForm';
import { useMountEffect } from '../../hooks';
import useSettings from '../../settings-provider/hooks/useSettings';
import { TableProps } from '../../table/Table';
import { INITIAL_PAGEINDEX } from '../constants';
import ListPageContent, { ListPageContentProps } from './ListPageContent';

/* -------------------------------------------------------------------------- */
/*                                    Types                                   */
/* -------------------------------------------------------------------------- */

export interface PagingListModel<TModel> {
  data: TModel[];
  dataCount: number;
}
export type ListPageModel<TModel> = PagingListModel<TModel>;
export type ListPageMeta = Pick<TableState, 'pagination' | 'sorting' | 'columnFilters'> & {
  segmentIndex?: number;
};

export type ListPageFilter<TFilter extends FieldValues> = TFilter & { meta: ListPageMeta };

export type NeedDataPayload<TFilter extends FieldValues> = {
  filter: ListPageFilter<TFilter>;
};

export interface ListPageFilterProps<
  TModel extends FieldValues,
  TFilter extends FieldValues = FieldValues,
> extends ListPageContentProps<TModel, TFilter> {
  form: UseFormReturn<TFilter>;
  /**
   * Form filter values change event
   */
  onChange?: (filter: TFilter, meta?: DeepPartial<ListPageMeta>) => void;
  /**
   * Default index of tab
   */
  defaultSegmentIndex?: number;

  meta?: ListPageMeta;
}

function ListPageFilter<TModel extends FieldValues, TFilter extends FieldValues = FieldValues>(
  props: ListPageFilterProps<TModel, TFilter>,
) {
  const { form, meta, tableProps: extableProps, onChange, defaultSegmentIndex, onClear } = props;

  const {
    reset,
    formState: { defaultValues },
    getFormModel,
  } = form;

  /* -------------------------------------------------------------------------- */
  /*                                    Hooks                                   */
  /* -------------------------------------------------------------------------- */

  const { pageSize: defaultPageSize } = useSettings();
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  /* -------------------------------------------------------------------------- */
  /*                                 Table Props                                */
  /* -------------------------------------------------------------------------- */

  const tableProps: Partial<TableProps<TModel>> = {
    enableSorting: true,
    enablePaging: true,
    manualPagination: true,
    enableRowSelection: true,
    manualSorting: true,
    manualFiltering: true,
    // setters
    onColumnFiltersChange: (columnFilters) =>
      handleSearch({ columnFilters } as DeepPartial<ListPageMeta>),
    onPaginationChange: (pagination) => handleSearch({ pagination } as DeepPartial<ListPageMeta>),
    onSortingChange: (sorting) => handleSearch({ sorting } as DeepPartial<ListPageMeta>),
    onRowSelectionChange: setRowSelection,
    ...extableProps,
    // states
    state: {
      pagination: meta?.pagination,
      sorting: meta?.sorting,
      columnFilters: meta?.columnFilters,
      rowSelection,
      ...extableProps.state,
    },
  };

  /* -------------------------------------------------------------------------- */
  /*                                   Events                                   */
  /* -------------------------------------------------------------------------- */

  /**
   * Get current form filter and update filter state
   */
  const handleSearch = async (meta?: DeepPartial<ListPageMeta>) => {
    try {
      // validate and get current filter from form
      const values = await getFormModel();
      onChange?.(values, meta);
    } catch {}
  };

  const clearForm = async () => {
    // reset form filters
    reset(defaultValues as TFilter, { keepDefaultValues: true });
    // reset form values
    handleSearch({
      ...extableProps?.initialState,
      segmentIndex: defaultSegmentIndex,
      pagination: {
        pageIndex: INITIAL_PAGEINDEX,
        pageSize: defaultPageSize,
        ...extableProps?.initialState?.pagination,
      },
    } as DeepPartial<ListPageMeta>);
    // clear callback
    onClear?.();
  };

  useMountEffect(() => {
    handleSearch();
  });

  /* --------------------------------- Render --------------------------------- */

  return (
    <ListPageContent
      {...props}
      onSearch={() =>
        handleSearch({
          pagination: {
            pageIndex: INITIAL_PAGEINDEX,
          },
        })
      }
      tableProps={tableProps}
      onTabChanged={(segmentIndex) => handleSearch({ segmentIndex })}
      onClear={clearForm}
    />
  );
}

export default ListPageFilter;
