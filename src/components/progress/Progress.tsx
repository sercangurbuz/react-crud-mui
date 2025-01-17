import { useEffect, useRef } from 'react';
import toast from 'react-hot-toast';

import LinearProgress, { LinearProgressProps } from '@mui/material/LinearProgress';
import { styled } from '@mui/material/styles';

import { SpinDelayOptions, useSpinDelay } from '../hooks/useSpinDelay';
import useTranslation from '../i18n/hooks/useTranslation';

const LoadingProgress = styled(LinearProgress)({
  height: 1,
  borderRadius: 0,
  margin: 0,
  flexGrow: 0,
});

export type ProgressProps = SpinDelayOptions &
  LinearProgressProps & {
    loading?: boolean;
    visible?: boolean;
    showTooLongNotification?: boolean;
  };

function Progress({
  loading,
  visible,
  delay,
  minDuration,
  maxDuration,
  ssr,
  showTooLongNotification,
  ...rest
}: ProgressProps) {
  const { isLoading: showSpinner, state } = useSpinDelay(!!loading, {
    delay,
    minDuration,
    maxDuration,
    ssr,
  });
  const toastRef = useRef<string | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    if (!showTooLongNotification) {
      return;
    }

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
  }, [state, t, showTooLongNotification]);

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
