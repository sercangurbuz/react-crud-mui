import { useMemo } from 'react';

import type { QueryKey, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';

import { RecordType, ServerError } from '../utils';
import axiosInstance from './axios';
import useAppQueryKey from './useAppQueryKey';
import useCommonHeaders from './useCommonHeaders';
import useMakeURI, { UseMakeURIOptions } from './useMakeFullURI';

export interface UseAppQueryOptions<TResult, TVariables = RecordType>
  extends Omit<UseQueryOptions<TResult>, 'queryKey'>,
    UseMakeURIOptions<TVariables> {
  queryKey?: QueryKey;
  variables?: TVariables;
  baseURL?: string;
}

export type UseAppQueryResult<TResult, ServerError> = UseQueryResult<TResult, ServerError> & {
  queryKey: QueryKey;
};

function useAppQuery<TResult, TVariables extends RecordType = RecordType>({
  url,
  action,
  queryKey: customQueryKey,
  variables,
  controller,
  baseURL,
  ...options
}: UseAppQueryOptions<TResult, TVariables>): UseAppQueryResult<TResult, ServerError> {
  const headers = useCommonHeaders();
  const makeURI = useMakeURI<TVariables>({ action, controller, url });
  const getDefaultCacheKey = useAppQueryKey({ action, controller });
  const queryKey = customQueryKey ?? getDefaultCacheKey(variables);

  const result = useQuery<TResult>({
    queryKey,
    queryFn: async ({ signal }) => {
      const uri = await makeURI(variables);
      const response = await axiosInstance.get<TResult>(uri, {
        params: variables,
        headers,
        baseURL,
        signal,
      });
      return response.data;
    },
    ...options,
  });

  const appResult = useMemo(
    () => ({ ...result, queryKey }) as UseAppQueryResult<TResult, ServerError>,
    [queryKey, result],
  );

  return appResult;
}
export default useAppQuery;
