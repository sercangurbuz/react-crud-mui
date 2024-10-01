const mergeWithKey = <T = unknown>(source: T[], target: T[], key: keyof T): T[] => {
  return target.reduce((memo, curr) => {
    const { [key]: keyValue } = curr;
    const foundItem = memo.find(({ [key]: compareKey }) => compareKey === keyValue);

    if (foundItem) {
      Object.assign(foundItem, curr);
    } else {
      memo.push(curr);
    }
    return memo;
  }, source);
};

export default mergeWithKey;
