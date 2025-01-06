import { useEffect, useRef } from 'react';
import toast from 'react-hot-toast';

import { LinearProgress, LinearProgressProps, styled } from '@mui/material';

import { useSpinDelay } from '../hooks/useSpinDelay';
import useTranslation from '../i18n/hooks/useTranslation';

const LoadingProgress = styled(LinearProgress)({
  height: 1,
  borderRadius: 0,
  margin: 0,
  flexGrow: 0,
});

function Progress({
  loading,
  visible,
  ...rest
}: LinearProgressProps & { loading?: boolean; visible?: boolean }) {
  const { isLoading: showSpinner, state } = useSpinDelay(!!loading);
  const toastRef = useRef<string | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    switch (state) {
      case 'TOO_LONG':
        toastRef.current = toast.loading(t('takingtoolong'), { position: 'top-center' });
        break;
      case 'IDLE':
        if (toastRef.current) {
          toast.dismiss(toastRef.current);
          toastRef.current = null;
        }
        break;
    }
  }, [state, t]);

  if (!visible && !showSpinner) {
    return null;
  }

  return (
    <LoadingProgress
      style={{ visibility: loading || visible ? 'visible' : 'hidden' }}
      variant={showSpinner ? 'indeterminate' : 'determinate'}
      value={0}
      {...rest}
    />
  );
}

export default Progress;
