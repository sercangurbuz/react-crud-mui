import { useMemo } from 'react';
import { FieldValues, useFormState } from 'react-hook-form';

import useListPage from './useListPage';

export interface ListPageCommandsFlag {
  search?: boolean;
  export?: boolean;
  clear?: boolean;
  create?: boolean;
}

export interface ListPageCommandsOptions {
  visible: ListPageCommandsFlag;
  disabled: ListPageCommandsFlag;
  loading?: boolean;
}

/**
 * Returns buttons props depending on validation,loading etc
 * Beware of rerender when state of form changes
 */
function useListPageCommandStates<TModel extends FieldValues>() {
  /* -------------------------------------------------------------------------- */
  /*                                    Hooks                                   */
  /* -------------------------------------------------------------------------- */

  const { loading, enableClear, enableCreateItem, enableExport, enableSearch } =
    useListPage<TModel>();
  const formStates = useFormState();

  const { isValid, isDirty } = formStates;

  /* ------------------------------ Button states ----------------------------- */

  const props = useMemo<ListPageCommandsOptions>(
    () => ({
      disabled: {
        search: !isValid || loading || !enableSearch,
        clear: (loading && !isDirty) || !enableClear,
        create: !enableCreateItem || loading,
        export: !enableExport || loading,
      },
      visible: {
        export: !!enableExport,
        clear: !!enableClear,
        search: !!enableSearch,
        create: !!enableCreateItem,
      },
      loading,
    }),
    [isValid, loading, enableSearch, isDirty, enableClear, enableCreateItem, enableExport],
  );

  return { ...props, formStates };
}

export default useListPageCommandStates;
