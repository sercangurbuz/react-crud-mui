import { useCallback } from 'react';
import { FieldValues } from 'react-hook-form';

import isNil from '../../misc/isNil';

interface UseArrayFieldHelpersOptions<TModel> {
  models?: TModel[];
  uniqueIdParamName?: string;
}

export const UNIQUE_IDENTIFIER_FIELD_NAME = '__$id__';

function useArrayFieldHelpers<TModel>({
  models,
  uniqueIdParamName = UNIQUE_IDENTIFIER_FIELD_NAME,
}: UseArrayFieldHelpersOptions<TModel> = {}) {
  const getUID = useCallback(
    (model?: TModel) => {
      return model ? (model as FieldValues)[uniqueIdParamName] : null;
    },
    [uniqueIdParamName],
  );

  const findByUID = useCallback(
    (uid: string) => {
      return models?.find((rec) => uid === getUID(rec));
    },
    [getUID, models],
  );

  const findIndexByUID = useCallback(
    (uid: string) => {
      return models?.findIndex((model) => getUID(model) === uid);
    },
    [getUID, models],
  );

  const findIndex = useCallback(
    (model?: TModel) => {
      const uid = getUID(model);
      return findIndexByUID(uid);
    },
    [findIndexByUID, getUID],
  );

  const findNext = useCallback(
    (uid: string) => {
      const listLenght = models?.length ?? 0;
      const currentIndex = findIndexByUID(uid);

      if (isNil(currentIndex) || currentIndex === -1) {
        return null;
      }

      let targetIndex;

      if (currentIndex + 1 < listLenght) {
        targetIndex = currentIndex + 1;
      } else {
        targetIndex = 0;
      }

      return models?.[targetIndex];
    },
    [findIndexByUID, models],
  );

  const findPrev = useCallback(
    (uid: string) => {
      const listLenght = models?.length ?? 0;
      const currentIndex = findIndexByUID(uid);

      if (isNil(currentIndex) || currentIndex === -1) {
        return null;
      }

      let targetIndex;

      if (currentIndex - 1 < 0) {
        targetIndex = listLenght - 1;
      } else {
        targetIndex = currentIndex - 1;
      }

      return models?.[targetIndex];
    },
    [findIndexByUID, models],
  );

  return { getUID, findByUID, findNext, findPrev, findIndexByUID, findIndex };
}

export default useArrayFieldHelpers;
