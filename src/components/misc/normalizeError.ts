import { ServerError } from '../utils';

function normalizeServerError(error: ServerError) {
  const result = [];
  if (error) {
    const statusCodeText = error.statusCode ? ` (Error code :${error.statusCode})` : '';

    if (error.errors) {
      result.push(...error.errors.map((item) => `${item.message}${statusCodeText}`));
    } else {
      result.push(`${error._error ?? error.message}${statusCodeText}`);
    }
  }

  return result;
}

export default normalizeServerError;
