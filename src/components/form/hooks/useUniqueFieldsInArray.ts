import { useCallback } from 'react';
import {
  FieldArray,
  FieldArrayPath,
  FieldPath,
  FieldValues,
  get,
  UseFieldArrayReturn,
} from 'react-hook-form';

import { NeedDataReason } from '../../detail-page/pages/DetailPageContent';
import useTranslation from '../../i18n/hooks/useTranslation';
import useArrayFieldHelpers, { UNIQUE_IDENTIFIER_FIELD_NAME } from './useArrayFieldHelpers';

export interface UniqueFieldsCheckFn<
  TModel extends FieldValues,
  TArrayModel extends FieldArray<TModel, TFieldArrayName> & FieldValues,
  TFieldArrayName extends FieldArrayPath<TModel> = FieldArrayPath<TModel>,
> {
  (
    options: UniqueFieldsCheckOptions<TArrayModel>,
    api: UseFieldArrayReturn<TModel, TFieldArrayName, typeof UNIQUE_IDENTIFIER_FIELD_NAME>,
  ): boolean;
}
export type UniqueFields<
  TModel extends FieldValues,
  TArrayModel extends FieldArray<TModel, TFieldArrayName> & FieldValues,
  TFieldArrayName extends FieldArrayPath<TModel> = FieldArrayPath<TModel>,
> = {
  fields: (FieldPath<TArrayModel> | UniqueFieldsCheckFn<TModel, TArrayModel, TFieldArrayName>)[];
  message?: string;
};

interface UseUniqueFieldsInArrayOptions<
  TModel extends FieldValues,
  TArrayModel extends FieldArray<TModel, TFieldArrayName> & FieldValues,
  TFieldArrayName extends FieldArrayPath<TModel> = FieldArrayPath<TModel>,
> {
  api: UseFieldArrayReturn<TModel, TFieldArrayName, typeof UNIQUE_IDENTIFIER_FIELD_NAME>;
  uniqueFields?: UniqueFields<TModel, TArrayModel, TFieldArrayName>[];
}

type UniqueFieldsCheckOptions<TModel extends FieldValues> = {
  model: TModel;
  reason: NeedDataReason;
  uid?: string;
};

function useUniqueFieldsInArray<
  TModel extends FieldValues,
  TArrayModel extends FieldArray<TModel, TFieldArrayName> & FieldValues,
  TFieldArrayName extends FieldArrayPath<TModel> = FieldArrayPath<TModel>,
>({ api, uniqueFields }: UseUniqueFieldsInArrayOptions<TModel, TArrayModel, TFieldArrayName>) {
  const { t } = useTranslation();
  const { getUID } = useArrayFieldHelpers();

  const checkUniqueFields = useCallback(
    (options: UniqueFieldsCheckOptions<TArrayModel>) => {
      const { uid, model, reason } = options;
      const conflicts = uniqueFields!.reduce<string[]>((messages, { fields, message }) => {
        const hasConflict = fields.every((fieldName) => {
          // evuluate as custom function
          if (typeof fieldName === 'function') {
            return fieldName(options, api);
          }

          // evuluate as model field
          return (
            api.fields.findIndex((field) => {
              if (reason === 'fetch' && getUID(field as TArrayModel) === uid) {
                return;
              }

              return get(field, fieldName) == get(model, fieldName);
            }) > -1
          );
        });

        if (hasConflict) {
          messages.push(
            message ??
              t('uniqueconstraint', {
                fields: fields.filter((cond) => typeof cond === 'string').join(','),
              }),
          );
        }

        return messages;
      }, []);

      return conflicts;
    },
    [api, getUID, t, uniqueFields],
  );

  return checkUniqueFields;
}

export default useUniqueFieldsInArray;
