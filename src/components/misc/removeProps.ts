import { RecordType } from '../utils';

function removeProps<T extends RecordType>(obj: T | T[], keys: string[]) {
  if (Array.isArray(obj)) {
    obj.forEach(function (item) {
      removeProps(item, keys);
    });
  } else if (typeof obj === 'object' && obj != null) {
    Object.getOwnPropertyNames(obj).forEach(function (key) {
      if (keys.indexOf(key) !== -1) delete obj[key];
      else removeProps(obj[key], keys);
    });
  }
}

export default removeProps;
