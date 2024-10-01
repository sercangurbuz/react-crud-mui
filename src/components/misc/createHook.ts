export type CommandHooks = { pre?: (key: string) => boolean | void; post?: (key: string) => void };

export const createHook = (key: string, fn?: () => void, commandHooks?: CommandHooks) => {
  if (!fn || !commandHooks) {
    return fn;
  }

  return new Proxy(fn, {
    apply: (target, thisArg, argumentsList) => {
      const invoke = commandHooks?.pre?.(key) ?? true;
      if (invoke) {
        return Reflect.apply(target, thisArg, argumentsList);
      }
    },
  });
};
