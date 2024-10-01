import { useMemo } from 'react';

import { ServerError } from '../../utils';
import Alerts from './Alerts';

export type ErrorNotificationType = 'alert' | 'notification' | 'message' | 'modal';

interface ErrorNotificationProps {
  /**
   * External error indicator
   */
  error?: ServerError;
}

function ErrorNotification({ error }: ErrorNotificationProps) {
  const messages = useMemo<string[] | undefined>(() => {
    if (!error) {
      return;
    }

    if (typeof error === 'string') {
      return [error];
    }

    if (typeof error?.messages === 'string') {
      return [error.messages];
    }

    if (typeof error?.message === 'string') {
      return [error.message];
    }

    return error.messages;
  }, [error]);

  return <Alerts messages={messages} />;
}

export default ErrorNotification;
