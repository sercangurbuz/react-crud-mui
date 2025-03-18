const isEmpty = function isEmpty<T extends Record<string, unknown>>(value?: T | null) {
  return !value || !Object.keys(value).length;
};

export default isEmpty;
