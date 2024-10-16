import { useMemo, useState } from 'react';
import { FieldValues } from 'react-hook-form';

import useListPageTableStates from '../hooks/useListPageTableStates';
import { ListPageFilter } from './ListPageData';
import ListPageForm, { ListPageFormProps } from './ListPageForm';

export interface ListPageProps<TModel extends FieldValues, TFilter extends FieldValues>
  extends Omit<ListPageFormProps<TModel, TFilter>, 'currentFilter'> {}

function ListPage<TModel extends FieldValues, TFilter extends FieldValues>(
  props: ListPageProps<TModel, TFilter>,
) {
  const { defaultSegmentIndex = 0, defaultFilter, defaultTableStates } = props;
  /* -------------------------------------------------------------------------- */
  /*                                    Hooks                                   */
  /* -------------------------------------------------------------------------- */

  // keep segment indicators here to manage in context
  const [activeSegmentIndex, setActiveSegmentIndex] = useState<number>(defaultSegmentIndex);
  /**
   * Form filter values
   */
  const [formFilter, setFormFilter] = useState<ListPageFilter<TFilter>>(
    defaultFilter as ListPageFilter<TFilter>,
  );
  /**
   * Table states (filters) intialized by external filter values or default states.
   * External values will override default states
   */
  const [tableStates, setters] = useListPageTableStates({
    defaultTableStates,
    defaultFilter,
  });

  /**
   * Current filter object
   */
  const filter = useMemo(() => {
    const result = Object.assign({}, formFilter, tableStates?.sorting, tableStates?.pagination);
    return result as unknown as ListPageFilter<TFilter>;
  }, [tableStates, formFilter]);

  return (
    <ListPageForm
      {...props}
      currentFilter={filter}
      tableStates={tableStates}
      tableStateSetters={setters}
      onFormFilterChange={setFormFilter}
      onTabChanged={setActiveSegmentIndex}
      activeSegmentIndex={activeSegmentIndex}
    />
  );
}

export default ListPage;
