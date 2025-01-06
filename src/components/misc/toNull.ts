function toNull<T>(value: T | undefined | null): T | null {
  return value === 'undefined' || value === undefined ? null : value;
}

export default toNull;
