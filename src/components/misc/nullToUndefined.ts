function nullToUndefined<T>(value: T | null | undefined) {
  return value === null ? undefined : value;
}

export default nullToUndefined;
