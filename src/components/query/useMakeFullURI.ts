import { useCallback } from 'react';

export interface UrlFn<TVariables> {
  (variables: TVariables): string | Promise<string>;
}

export interface UseMakeURIOptions<TVariables> {
  url?: string | UrlFn<TVariables>;
  action?: string | UrlFn<TVariables>;
  controller?: string | UrlFn<TVariables>;
}

function useMakeURI<TVariables>({ action, url, controller }: UseMakeURIOptions<TVariables>) {
  const makeUri = useCallback(
    async (variables: TVariables = {} as TVariables) => {
      let uri = typeof url === 'function' ? await url(variables) : url;

      if (!uri) {
        const actionUrl = typeof action === 'function' ? await action(variables) : action;
        const contollerUrl =
          typeof controller === 'function' ? await controller(variables) : controller;
        uri = `${contollerUrl}/${actionUrl}`;
      }

      return uri;
    },
    [action, controller, url],
  );

  return makeUri;
}

export default useMakeURI;
