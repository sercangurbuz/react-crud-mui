import { useContext } from 'react';
import { FieldArray, FieldArrayPath, FieldValues } from 'react-hook-form';

import {
  EditableListContext,
  EditableListContextValue,
} from '../EditableList';

function useEditableListContext<
  TModel extends FieldValues,
  TArrayModel extends FieldArray<TModel, TFieldArrayName> & FieldValues,
  TFieldArrayName extends FieldArrayPath<TModel>,
>() {
  return useContext(EditableListContext) as EditableListContextValue<
    TModel,
    TArrayModel,
    TFieldArrayName
  >;
}

export default useEditableListContext;
