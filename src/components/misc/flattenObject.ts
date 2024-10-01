import { RecordType } from '../utils';

const flattenObject = <T extends RecordType>(obj: T, prefix = '') =>
  Object.keys(obj).reduce<RecordType>((acc, k) => {
    const pre = prefix.length ? prefix + '.' : '';
    if (obj[k]) {
      if (typeof obj[k] === 'object') {
        Object.assign(acc, flattenObject(obj[k], pre + k));
      } else {
        acc[pre + k] = obj[k];
      }
    }
    return acc;
  }, {});

export default flattenObject;
