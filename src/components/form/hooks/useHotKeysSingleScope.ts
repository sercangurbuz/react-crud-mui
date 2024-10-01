import { useEffect, useRef } from 'react';
import { useHotkeysContext } from 'react-hotkeys-hook';

import { useMountEffect } from '../../hooks';

interface UseHotKeysScopeOptions {
  targetScope: string;
}

/**
 * Keep only target scope active while disabling other scopes to prevent hotkey conflict
 */
function useHotKeysSingleScope({ targetScope }: UseHotKeysScopeOptions) {
  const { enabledScopes, disableScope, enableScope } = useHotkeysContext();

  const originalScopesRef = useRef<string[] | null>(null);

  if (!originalScopesRef.current) {
    originalScopesRef.current = enabledScopes;
  }

  useMountEffect(() => {
    if (!targetScope) {
      return;
    }

    enabledScopes?.forEach((scope) => scope !== '*' && disableScope(scope));
    enableScope(targetScope);
  }, [disableScope, enableScope, enabledScopes, targetScope]);

  useEffect(
    () => () => {
      if (!targetScope) {
        return;
      }

      disableScope(targetScope);
      originalScopesRef.current?.forEach((scope) => scope !== '*' && enableScope(scope));
    },
    [disableScope, enableScope, targetScope],
  );

  return [] as const;
}

export default useHotKeysSingleScope;
