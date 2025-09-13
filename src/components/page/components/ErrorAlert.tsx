import normalizeServerError from '../../misc/normalizeError';
import { ServerError } from '../../utils';
import Alerts from './Alerts';

interface ErrorAlertProps {
  error?: ServerError;
}

function ErrorAlert({ error }: ErrorAlertProps) {
  const messages = error ? normalizeServerError(error) : [];
  return <Alerts messages={messages} />;
}

export default ErrorAlert;
