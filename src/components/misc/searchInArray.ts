import dayjs from 'dayjs';

import { RecordType } from '../utils';

type SearchOptions = {
  culture?: string;
  level?: number;
  fields?: string | string[];
};

function searchInObject<T extends RecordType>(
  keyword: string,
  data: T,
  options: SearchOptions,
  currentLevel: number,
): boolean {
  if (!data) {
    return false;
  }

  const { culture, fields, level = 1 } = options;

  const hasKeyword = Object.entries(data)
    .filter(([key]) => {
      return fields ? (Array.isArray(fields) ? fields.includes(key) : fields === key) : true;
    })
    .some(([, value]) => {
      switch (typeof value) {
        case 'string':
          return value.toLocaleLowerCase(culture).includes(keyword.toLocaleLowerCase(culture));
        case 'number':
          return String(value).includes(keyword);
        case 'object': {
          if (dayjs.isDayjs(value)) {
            return value.format().includes(keyword);
          }

          if (currentLevel >= level) {
            return false;
          }

          if (Array.isArray(value)) {
            const arrayResult = searchInArray(keyword, value, options, ++currentLevel);
            return !!arrayResult?.length;
          }

          return searchInObject(keyword, value, options, ++currentLevel);
        }
      }
    });

  return hasKeyword;
}

function searchInArray<T extends RecordType>(
  keyword: string,
  data: T[],
  options?: SearchOptions,
  currentLevel = 1,
): T[] {
  if (!keyword || !data?.length) {
    return data;
  }
  const config = Object.assign({ culture: 'en', level: 1 }, options);

  if (config.level < 1) {
    throw new Error('level must be greater than 0,default 1');
  }

  return data.filter((row) => searchInObject(keyword, row, config, currentLevel));
}

export default searchInArray;
