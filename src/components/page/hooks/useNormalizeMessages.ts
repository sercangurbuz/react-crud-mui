import { useMemo } from 'react';

import type { AlertProps } from '@mui/material/Alert';
import groupBy from 'lodash.groupby';

export type TypeMessage = {
  title?: React.ReactNode;
  message: React.ReactNode;
  type: AlertProps['severity'];
};
export type Message = string | TypeMessage;

interface useNormalizeMessagesOptions {
  messages?: Message[];
  defaultType?: AlertProps['severity'];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isTypeMessage(value: any): value is TypeMessage {
  return typeof value === 'object' && 'message' in value;
}

function useNormalizeMessages({ messages, defaultType }: useNormalizeMessagesOptions) {
  const alerts = useMemo(() => {
    const normalizedMessages = messages?.map((message) =>
      isTypeMessage(message) ? message : { message, type: defaultType },
    );
    return groupBy(normalizedMessages, (msg) => msg.type ?? defaultType);
  }, [defaultType, messages]);
  return alerts;
}

export default useNormalizeMessages;
