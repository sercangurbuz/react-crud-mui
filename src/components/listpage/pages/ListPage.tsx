import { useMemo, useState } from 'react';
import { FieldValues } from 'react-hook-form';

import useListPageTableProps from '../hooks/useListPageTableProps';
import { ListPageFilter } from './ListPageData';
import ListPageForm, { ListPageFormProps } from './ListPageForm';

export interface ListPageProps<TModel extends FieldValues, TFilter extends FieldValues>
  extends Omit<ListPageFormProps<TModel, TFilter>, 'currentFilter'> {}

function ListPage<TModel extends FieldValues, TFilter extends FieldValues>(
  props: ListPageProps<TModel, TFilter>,
) {
  const { defaultSegmentIndex = 0, defaultFilter, defaultValues, tableProps: exTableProps } = props;
  /* -------------------------------------------------------------------------- */
  /*                                    Hooks                                   */
  /* -------------------------------------------------------------------------- */

  // keep segment indicators here to manage in context
  const [activeSegmentIndex, setActiveSegmentIndex] = useState<number>(defaultSegmentIndex);
  /**
   * Form filter values
   */
  const [formFilter, setFormFilter] = useState<ListPageFilter<TFilter>>(
    (defaultFilter ?? defaultValues) as ListPageFilter<TFilter>,
  );

  const tableProps = useListPageTableProps<TFilter, TModel>({
    // custom states given by user
    initialState: exTableProps?.state ?? exTableProps?.initialState,
    // filter on which states gets extracted from
    defaultFilter,
  });

  /**
   * Current filter object
   */
  const filter = useMemo(() => {
    return {
      ...formFilter,
      sorting: tableProps.state?.sorting,
      pagination: tableProps.state?.pagination,
    } as ListPageFilter<TFilter>;
  }, [tableProps.state?.sorting, tableProps.state?.pagination, formFilter]);

  return (
    <ListPageForm
      {...props}
      currentFilter={filter}
      tableProps={tableProps}
      onFormFilterChange={setFormFilter}
      onTabChanged={setActiveSegmentIndex}
      activeSegmentIndex={activeSegmentIndex}
    />
  );
}

export default ListPage;
