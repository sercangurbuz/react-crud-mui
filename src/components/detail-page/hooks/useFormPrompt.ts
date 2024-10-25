// https://gist.github.com/chaance/2f3c14ec2351a175024f62fd6ba64aa6

// You can abstract `useBlocker` to use the browser's `window.confirm` dialog to
// determine whether or not the user should navigate within the current origin.
// `useBlocker` can also be used in conjunction with `useBeforeUnload` to
// prevent navigation away from the current origin.
//
// IMPORTANT: There are edge cases with this behavior in which React Router
// cannot reliably access the correct location in the history stack. In such
// cases the user may attempt to stay on the page but the app navigates anyway,
// or the app may stay on the correct page but the browser's history stack gets
// out of whack. You should test your own implementation thoroughly to make sure
// the tradeoffs are right for your users.

import React from 'react';
import { useFormState } from 'react-hook-form';
import { Location, useBeforeUnload, useBlocker } from 'react-router-dom';

import useTranslation from '../../i18n/hooks/useTranslation';

export type BlockerFunction = (args: {
  currentLocation: Location;
  nextLocation: Location;
}) => boolean;

export interface UseFormPromptProps {
  confirmDirtyChanges?: boolean;
  ignoreSearchParams?: boolean;
  beforeUnload?: boolean;
}

function useFormPrompt({
  ignoreSearchParams,
  beforeUnload = true,
  confirmDirtyChanges = true,
}: UseFormPromptProps) {
  /* -------------------------------------------------------------------------- */
  /*                                    Hooks                                   */
  /* -------------------------------------------------------------------------- */
  const { isDirty } = useFormState();
  const { t } = useTranslation();

  const promptText = t('promptunsavedchanges');
  const when = isDirty && !!confirmDirtyChanges;

  const blocker = useBlocker(
    React.useCallback<BlockerFunction>(
      ({ nextLocation, currentLocation }) => {
        // ignore preventing for individual navigations
        const { noBlock } = nextLocation.state || {};
        // compare only pathname ignoring search params
        const redirect =
          noBlock !== true &&
          (ignoreSearchParams || nextLocation.pathname !== currentLocation.pathname);

        if (redirect && when) {
          return !window.confirm(promptText);
        }

        return false;
      },
      [ignoreSearchParams, when, promptText],
    ),
  );

  const prevState = React.useRef(blocker.state);
  React.useEffect(() => {
    if (blocker.state === 'blocked') {
      blocker.reset();
    }
    prevState.current = blocker.state;
  }, [blocker]);

  useBeforeUnload(
    React.useCallback(
      (event) => {
        if (beforeUnload && when) {
          event.preventDefault();
          event.returnValue = promptText;
        }
      },
      [beforeUnload, promptText, when],
    ),
    { capture: true },
  );
}

export default useFormPrompt;
