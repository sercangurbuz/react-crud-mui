import { EnumObj } from '../utils';

export interface EnumArrayItem {
  id: number;
  name: string;
  [index: string]: number | string;
}

export default (obj: EnumObj, valueField = 'id', displayField = 'name'): EnumArrayItem[] => {
  const map: Partial<EnumArrayItem>[] = [];

  for (const id in obj) {
    // eslint-disable-next-line no-prototype-builtins
    if (obj.hasOwnProperty(id) && typeof obj[id] !== 'number') {
      const idValue = parseInt(id);
      map.push({
        [valueField as string]: isNaN(idValue) ? id : idValue,
        [displayField as string]: obj[id],
      });
    }
  }
  return map as EnumArrayItem[];
};
