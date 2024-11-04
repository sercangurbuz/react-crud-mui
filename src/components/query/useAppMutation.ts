import { useMutation, UseMutationOptions, UseMutationResult } from '@tanstack/react-query';
import { AxiosRequestConfig } from 'axios';

import { RecordType, ServerError } from '../utils';
import axiosInstance from './axios';
import useCommonHeaders from './useCommonHeaders';
import useMakeURI, { UseMakeURIOptions } from './useMakeFullURI';

export interface UseAppMutationOptions<TData, TVariables>
  extends UseMutationOptions<TData, ServerError, TVariables>,
    UseMakeURIOptions<TVariables> {
  baseURL?: string;
  method?: AxiosRequestConfig['method'];
}

function useAppMutation<TData, TVariables extends RecordType>({
  url,
  action,
  method = 'POST',
  baseURL,
  controller,
  ...options
}: UseAppMutationOptions<TData, TVariables>): UseMutationResult<
  TData,
  ServerError,
  TVariables,
  unknown
> {
  const headers = useCommonHeaders();
  const makeURI = useMakeURI<TVariables>({ action, controller, url });

  const result = useMutation<TData, ServerError, TVariables>({
    mutationFn: async (variables) => {
      const uri = await makeURI(variables);
      const response =
        method === 'DELETE'
          ? await axiosInstance.delete(uri, {
              headers,
              baseURL,
            })
          : await axiosInstance.post(uri, variables, {
              headers,
              baseURL,
            });

      return response.data as TData;
    },
    ...options,
  });

  return result;
}

export default useAppMutation;
