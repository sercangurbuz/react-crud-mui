import { RecordType } from '../../utils';

const parseParams = (params: RecordType) => {
  const keys = Object.keys(params);
  let options = '';

  //Iterate all params
  keys.forEach((key) => {
    //ignore undefined and null
    if (params[key] === undefined || params[key] === null) return;

    const isParamTypeObject = typeof params[key] === 'object';

    if (!isParamTypeObject) {
      //string ,number,boolean
      options += `${key}=${encodeURIComponent(params[key])}&`;
    } else {
      //array
      if (Array.isArray(params[key])) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        params[key].forEach((element: any) => {
          if (element === undefined || element === null) return;

          const toJSONFn = element.toJSON;
          if (typeof toJSONFn === 'function') {
            options += `${key}=${encodeURIComponent(toJSONFn.call(element))}&`;
          } else {
            options += `${key}=${element}&`;
          }
        });
      } else {
        //run toJSON function if available foı moment/dayjs objects
        //https://stackoverflow.com/a/14991571/1016147
        const toJSONFn = params[key].toJSON;
        if (typeof toJSONFn === 'function') {
          options += `${key}=${encodeURIComponent(toJSONFn.call(params[key]))}&`;
        }
      }
    }
  });

  return options ? options.slice(0, -1) : options;
};

export default parseParams;
