const isDefined = function isDefined<T>(value: T) {
  return value !== null && value !== undefined;
};

export default isDefined;
