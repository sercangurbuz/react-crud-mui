import { RecordType } from '../utils';

function removeFalsy<T extends RecordType>(value: T) {
  const cleanObject = Object.entries(value)
    .filter(([, value]) => {
      return !(value === undefined || value === null || (value as unknown) === '');
    })
    .reduce((res, [key, value]) => {
      return Object.assign(res, { [key]: value });
    }, {} as T);

  return cleanObject;
}

export default removeFalsy;
