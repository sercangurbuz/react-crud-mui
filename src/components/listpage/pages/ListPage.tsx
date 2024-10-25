import { useMemo, useState } from 'react';
import { FieldValues } from 'react-hook-form';

import useListPageTableProps from '../hooks/useListPageTableProps';
import { ListPageFilter, ListPageMeta } from './ListPageData';
import ListPageForm, { ListPageFormProps } from './ListPageForm';

export interface ListPageProps<
  TModel extends FieldValues,
  TFilter extends FieldValues = FieldValues,
> extends Omit<ListPageFormProps<TModel, TFilter>, 'currentFilter' | 'meta'> {}

function ListPage<TModel extends FieldValues, TFilter extends FieldValues = FieldValues>(
  props: ListPageProps<TModel, TFilter>,
) {
  const { defaultSegmentIndex = 0, defaultFilter, defaultValues, tableProps: exTableProps } = props;
  /* -------------------------------------------------------------------------- */
  /*                                    Hooks                                   */
  /* -------------------------------------------------------------------------- */

  // keep segment indicators here to manage in context
  const [activeSegmentIndex, setActiveSegmentIndex] = useState<number>(
    defaultFilter?.activeSegmentIndex ?? defaultSegmentIndex,
  );

  //Form filter values
  const [formFilter, setFormFilter] = useState<TFilter>(
    (defaultFilter ?? defaultValues) as TFilter,
  );

  // controlled table props
  const tableProps = useListPageTableProps<TFilter, TModel>({
    initialState: exTableProps?.initialState,
    // filter which states gets extracted from
    defaultFilter,
  });

  // meta options
  const meta = useMemo(() => {
    return {
      sorting: tableProps.state?.sorting,
      pagination: tableProps.state?.pagination,
      activeSegmentIndex,
    } as ListPageMeta;
  }, [tableProps.state?.sorting, tableProps.state?.pagination, activeSegmentIndex]);

  return (
    <ListPageForm
      {...props}
      formFilter={formFilter}
      meta={meta}
      tableProps={tableProps}
      activeSegmentIndex={activeSegmentIndex}
      onFormFilterChange={setFormFilter}
      onTabChanged={setActiveSegmentIndex}
    />
  );
}

export default ListPage;
