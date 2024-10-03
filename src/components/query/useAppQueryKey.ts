import { useCallback } from 'react';

import kebabCase from 'lodash.kebabcase';

import { UseMakeURIOptions } from './useMakeFullURI';

export interface UseAppQueryKey<TVariables>
  extends Pick<UseMakeURIOptions<TVariables>, 'action' | 'controller'> {}

function useAppQueryKey<TVariables>({ action, controller }: UseAppQueryKey<TVariables>) {
  const getQueryKey = useCallback(
    (variables?: TVariables) => {
      const keys = [];
      if (typeof controller === 'string') {
        keys.push(kebabCase(controller));
      }

      if (typeof action === 'string') {
        keys.push(kebabCase(action));
      }

      if (variables) {
        keys.push(variables);
      }

      return keys;
    },
    [action, controller],
  );

  return getQueryKey;
}

export default useAppQueryKey;
