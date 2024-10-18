import { useCallback, useEffect } from 'react';
import { FieldValues } from 'react-hook-form';

import { TableState } from '@tanstack/react-table';

import { UseFormReturn } from '../../form/hooks/useForm';
import { useMountEffect, useUpdateEffect } from '../../hooks';
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

export type PagingFields = Pick<TableState, 'pagination' | 'sorting'>;
export type ListPageFilter<TFilter extends FieldValues> = TFilter & PagingFields;

export type NeedDataPayload<TFilter extends FieldValues> = {
  filter: TFilter;
};

export interface ListPageDataProps<TModel extends FieldValues, TFilter extends FieldValues>
  extends ListPageContentProps<TModel, TFilter> {
  form: UseFormReturn<ListPageFilter<TFilter>>;
  /**
   * External filter criteries
   */
  defaultFilter?: ListPageFilter<TFilter>;
  /**
   * Data fetcher function with given filter
   * ==> MUST BE MEMOIZED <==
   */
  onNeedData?: (filter: ListPageFilter<TFilter>) => void;
  /**
   * Form filter values change event
   */
  onFormFilterChange?: (values: ListPageFilter<TFilter>) => void;
  /**
   * Default index of tab
   */
  defaultSegmentIndex?: number;
}

function ListPageData<TModel extends FieldValues, TFilter extends FieldValues>({
  form,
  onFormFilterChange,
  tableProps,
  onTabChanged,
  defaultSegmentIndex = 0,
  onClear,
  currentFilter,
  onNeedData,
  ...lpProps
}: ListPageDataProps<TModel, TFilter>) {
  const {
    reset,
    formState: { defaultValues },
    getFormModel,
  } = form;

  const { onPaginationChange, onColumnFiltersChange, onSortingChange } = tableProps;
  /* -------------------------------------------------------------------------- */
  /*                                    Hooks                                   */
  /* -------------------------------------------------------------------------- */

  /* -------------------------------------------------------------------------- */
  /*                                   Events                                   */
  /* -------------------------------------------------------------------------- */

  const clearForm = () => {
    // reset form filters
    reset(defaultValues as ListPageFilter<TFilter>, { keepDefaultValues: true });
    // reset tab index
    onTabChanged?.(defaultSegmentIndex);
    // clear table states
    onPaginationChange?.((props) => ({
      pageSize: props?.pageSize,
      pageIndex: INITIAL_PAGEINDEX,
    }));
    onSortingChange?.([]);
    onColumnFiltersChange?.([]);
    // clear callback
    onClear?.();
  };

  /**
   * Get current form filter and update filter state
   */
  const initSearch = useCallback(async () => {
    try {
      // get current filter from form
      const filter = await getFormModel();
      // set form model
      onFormFilterChange?.(filter);
      // reset pagination
      onPaginationChange?.((props) => ({
        pageSize: props.pageSize,
        pageIndex: INITIAL_PAGEINDEX,
      }));
    } catch {}
  }, [getFormModel, onFormFilterChange, onPaginationChange]);

  /* -------------------------------------------------------------------------- */
  /*                                Data Effects                                */
  /* -------------------------------------------------------------------------- */

  useEffect(() => {
    onNeedData?.(currentFilter!);
  }, [currentFilter, onNeedData]);

  /* --------------------------------- Render --------------------------------- */

  return (
    <ListPageContent
      {...lpProps}
      onSearch={initSearch}
      tableProps={tableProps}
      onTabChanged={onTabChanged}
      onClear={clearForm}
      currentFilter={currentFilter}
    />
  );
}

export default ListPageData;
