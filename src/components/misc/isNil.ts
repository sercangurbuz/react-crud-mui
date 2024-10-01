function isNil<T>(value: T | undefined | null): value is undefined | null {
  return value === 'undefined' || value === undefined || value === null;
}

export default isNil;
