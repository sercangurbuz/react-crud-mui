import React, { PropsWithChildren, ReactNode, useCallback, useMemo, useReducer } from 'react';
import { FieldValues, Path } from 'react-hook-form';

import { produce } from 'immer';

import { isDev } from '../../misc/isDev';

/* -------------------------------------------------------------------------- */
/*                                    Types                                   */
/* -------------------------------------------------------------------------- */

export type FieldData<TFieldValues extends FieldValues = FieldValues> = {
  group?: string;
  label?: ReactNode;
  name: Path<TFieldValues>;
};

interface GetFieldPredicate<TFieldValues extends FieldValues> {
  (data: FieldData<TFieldValues>): boolean;
}

export interface FormHelperContextValue<TFieldValues extends FieldValues = FieldValues> {
  /**
   * Get fields data with given filter
   */
  getFields: (filter?: GetFieldPredicate<TFieldValues>) => FieldData<TFieldValues>[];
  /**
   * Register extra data of field
   */
  registerField: (data: FieldData<TFieldValues>) => void;

  unRegisterField: (name: Path<TFieldValues>) => void;
  /**
   * Grouped fields object which of key is group name and value is fields array
   */
  groups: (group: string) => string[];
  /**
   * Fields with extra meta which of key is field itself and value is meta
   */
  fields: Map<string, FieldData<TFieldValues>>;
}

/* ------------------------------ Form Context ------------------------------ */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const FormHelperContext = React.createContext<FormHelperContextValue<any> | null>(null);

type ActionPayload<TFieldValues extends FieldValues = FieldValues> =
  | {
      type: 'register';
      data: FieldData<TFieldValues>;
    }
  | {
      type: 'unregister';
      name: string;
    };

const reducer = produce<Map<string, FieldData>, [ActionPayload]>((draft, action) => {
  switch (action.type) {
    case 'register': {
      draft.set(action.data.name, action.data);
      break;
    }
    case 'unregister': {
      if (!draft.has(action.name)) {
        if (isDev()) {
          console.error(`Warning: field not found with name "${action.name}" while unregistering`);
        }
        return;
      }
      draft.delete(action.name);
      break;
    }
  }
});

function FormHelperProvider<TFieldValues extends FieldValues>({ children }: PropsWithChildren) {
  /* -------------------------------------------------------------------------- */
  /*                                    Hooks                                   */
  /* -------------------------------------------------------------------------- */

  const [fields, dispatch] = useReducer(reducer, new Map());

  /* -------------------------------------------------------------------------- */
  /*                                 Methods                                    */
  /* -------------------------------------------------------------------------- */

  const registerField = useCallback((data: FieldData<TFieldValues>) => {
    dispatch({ type: 'register', data: data as FieldData<FieldValues> });
  }, []);

  const unRegisterField = useCallback((name: Path<TFieldValues>) => {
    dispatch({ type: 'unregister', name });
  }, []);

  const getFields = useCallback(
    (predicate?: GetFieldPredicate<TFieldValues>) => {
      if (predicate) {
        return Object.values(fields).filter(predicate) as FieldData<TFieldValues>[];
      }
      return Object.values(fields) as FieldData<TFieldValues>[];
    },
    [fields],
  );

  const groups = useCallback(
    (group: string) => {
      return Array.from(fields)
        .filter(([, value]) => value.group === group)
        .map(([key]) => key);
    },
    [fields],
  );

  const contextValue = useMemo<FormHelperContextValue<TFieldValues>>(
    () => ({
      registerField: registerField as (data: FieldData<TFieldValues>) => void,
      unRegisterField,
      getFields,
      groups,
      fields: fields as Map<string, FieldData<TFieldValues>>,
    }),
    [fields, getFields, groups, registerField, unRegisterField],
  );

  return <FormHelperContext.Provider value={contextValue}>{children}</FormHelperContext.Provider>;
}

export default FormHelperProvider;
