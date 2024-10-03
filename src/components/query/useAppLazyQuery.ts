import { useCallback, useEffect, useRef } from 'react';

import { useMutation, UseMutationOptions } from '@tanstack/react-query';

import { RecordType, ServerError } from '../utils';
import axiosInstance from './axios';
import useCommonHeaders from './useCommonHeaders';
import useMakeURI, { UseMakeURIOptions } from './useMakeFullURI';

export interface UseAppLazyQueryOptions<TData, TVariables = RecordType>
  extends UseMutationOptions<TData, ServerError, TVariables>,
    UseMakeURIOptions<TVariables> {
  baseURL?: string;
  resultPropName?: string;
  variables?: Partial<TVariables>;
}

function useAppLazyQuery<TData, TVariables extends RecordType = RecordType>({
  url,
  action,
  resultPropName,
  baseURL,
  controller,
  variables: initialVariables,
  ...options
}: UseAppLazyQueryOptions<TData, TVariables>) {
  const headers = useCommonHeaders();
  const makeURI = useMakeURI<TVariables>({ action, controller, url });
  const abortControllerRef = useRef<AbortController | null>(null);

  const { mutate, mutateAsync, variables, status, ...restOptions } = useMutation<
    TData,
    ServerError,
    TVariables
  >({
    mutationFn: async (variables) => {
      abortControllerRef.current = new AbortController();
      const params = Object.assign({}, initialVariables, variables);
      const uri = await makeURI(params);
      const response = await axiosInstance.get(uri, {
        params,
        headers,
        baseURL,
        signal: abortControllerRef.current.signal,
      });
      return response.data;
    },
    ...options,
  });

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  const fetch = useCallback(
    (variables: TVariables) => {
      mutate(variables);
    },
    [mutate],
  );

  const fetchAsync = useCallback(
    (variables: TVariables) => {
      return mutateAsync(variables);
    },
    [mutateAsync],
  );

  const refetch = useCallback(() => {
    if (status === 'success' || status === 'error') {
      return mutate(variables as TVariables);
    }
  }, [mutate, variables, status]);

  return {
    ...restOptions,
    status,
    variables,
    refetch,
    fetch,
    fetchAsync,
  };
}

export default useAppLazyQuery;
