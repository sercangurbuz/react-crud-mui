function undefinedToNull<T>(value: T | undefined) {
  return typeof value === 'undefined' ? null : value;
}

export default undefinedToNull;
