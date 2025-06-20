import React, { useEffect, useState } from 'react';

import styled from '@emotion/styled';
import Alert, { AlertProps } from '@mui/material/Alert';

import useNormalizeMessages, { Message } from '../hooks/useNormalizeMessages';

/* ---------------------------------- Types --------------------------------- */

interface AlertsProps {
  messages?: Message[];
  defaultType?: AlertProps['severity'];
}

/* ---------------------------- Styled Component ---------------------------- */

const Messages = styled.ul`
  padding: 0;
  margin: 0;
  > li {
    list-style: none;
  }
`;

/* ---------------------------- Alerts Component ---------------------------- */

function Alerts({ messages, defaultType = 'error' }: AlertsProps) {
  const alerts = useNormalizeMessages({ messages, defaultType });
  const [showAlerts, setShowAlerts] = useState<boolean>();

  useEffect(() => {
    setShowAlerts(!!Object.keys(alerts).length);
  }, [alerts]);

  const nodes: React.ReactNode[] = [];

  for (const type in alerts) {
    nodes.push(
      <Alert
        variant="outlined"
        key={type}
        severity={type as AlertProps['severity']}
        sx={{ borderRadius: 0, border: 'none', display: showAlerts ? 'flex' : 'none' }}
        onClose={() => setShowAlerts(false)}
      >
        <Messages>
          {alerts[type].map((msg, index) => (
            <li key={index}>{msg.message}</li>
          ))}
        </Messages>
      </Alert>,
    );
  }

  return <>{nodes}</>;
}

export default Alerts;
