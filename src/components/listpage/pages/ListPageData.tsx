import { useCallback, useEffect } from 'react';
import { FieldValues, useFormContext, useFormState } from 'react-hook-form';

import { PaginationState } from '@tanstack/react-table';

import { UseFormReturn } from '../../form/hooks/useForm';
import useSettings from '../../settings-provider/hooks/useSettings';
import { INITIAL_PAGEINDEX } from '../constants';
import { DefaultTableState } from '../hooks/useListPageTableProps';
import ListPageContent, { ListPageContentProps } from './ListPageContent';

/* -------------------------------------------------------------------------- */
/*                                    Types                                   */
/* -------------------------------------------------------------------------- */

export interface PagingListModel<TModel> {
  data: TModel[];
  dataCount: number;
}
export type ListPageModel<TModel> = PagingListModel<TModel>;

export type ListPageMeta = DefaultTableState & { activeSegmentIndex?: number };
export type ListPageFilter<TFilter extends FieldValues> = TFilter & ListPageMeta;

export type NeedDataPayload<TFilter extends FieldValues> = {
  filter: TFilter;
};

export interface ListPageDataProps<
  TModel extends FieldValues,
  TFilter extends FieldValues = FieldValues,
> extends ListPageContentProps<TModel, TFilter> {
  form: UseFormReturn<TFilter>;
  /**
   * External filter criteries
   */
  defaultFilter?: ListPageFilter<TFilter>;
  /**
   * Data fetcher function with given filter
   * ==> MUST BE MEMOIZED <==
   */
  onNeedData?: (filter: TFilter, meta: ListPageMeta) => void;
  /**
   * Form filter values change event
   */
  onFormFilterChange?: (values: TFilter) => void;
  /**
   * Default index of tab
   */
  defaultSegmentIndex?: number;
}

function ListPageData<TModel extends FieldValues, TFilter extends FieldValues = FieldValues>({
  form,
  onFormFilterChange,
  tableProps,
  onTabChanged,
  defaultSegmentIndex = 0,
  onClear,
  formFilter,
  meta,
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

  const { pageSize: defaultPageSize } = useSettings();

  /* -------------------------------------------------------------------------- */
  /*                                   Events                                   */
  /* -------------------------------------------------------------------------- */

  const clearForm = async () => {
    // reset form filters
    reset(defaultValues as TFilter, { keepDefaultValues: true });
    // reset form values
    onFormFilterChange?.(defaultValues as TFilter);
    // reset tab index
    onTabChanged?.(defaultSegmentIndex);
    // reset to defaults
    onSortingChange?.(tableProps.initialState?.sorting ?? []);
    onPaginationChange?.(
      (tableProps.initialState?.pagination as PaginationState) ?? {
        pageIndex: INITIAL_PAGEINDEX,
        pageSize: defaultPageSize,
      },
    );
    onColumnFiltersChange?.(tableProps.initialState?.columnFilters ?? []);
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
    onNeedData?.(formFilter!, meta);
  }, [formFilter, onNeedData, meta]);

  /* --------------------------------- Render --------------------------------- */

  return (
    <ListPageContent
      {...lpProps}
      onSearch={initSearch}
      tableProps={tableProps}
      onTabChanged={onTabChanged}
      onClear={clearForm}
      formFilter={formFilter}
      meta={meta}
    />
  );
}

export default ListPageData;
