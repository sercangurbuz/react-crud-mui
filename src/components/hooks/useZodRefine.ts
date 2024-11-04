import { useCallback, useState } from 'react';

import { RefinementCtx, z, ZodIssueBase, ZodObject, ZodRawShape, ZodTypeAny } from 'zod';

export interface UseZodRefineOptions<T extends ZodRawShape> {
  schema: ZodObject<T>;
}

export type ZodRefineOptions<T extends ZodRawShape> = {
  path?: ZodIssueBase['path'];
  message?: ZodIssueBase['message'] | ((arg: z.output<ZodObject<T>>) => ZodIssueBase['message']);
};

export interface ZodRefine<
  T extends ZodRawShape,
  Mask extends {
    [k in keyof T]?: true;
  },
> {
  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  (arg: z.output<ZodObject<Pick<T, Extract<keyof T, keyof Mask>>>>): unknown | Promise<unknown>;
}

export interface ZodSuperRefine<
  T extends ZodRawShape,
  Mask extends {
    [k in keyof T]?: true;
  },
> {
  (arg: z.output<ZodObject<Pick<T, Extract<keyof T, keyof Mask>>>>, ctx: RefinementCtx): void;
}

function useZodRefine<T extends ZodRawShape>({ schema }: UseZodRefineOptions<T>) {
  const [defaultSchema, setSchema] = useState<ZodTypeAny>(schema);

  const addRefine = useCallback(
    <
      Mask extends {
        [k in keyof T]?: true;
      },
    >(
      mask: Mask,
      refine: ZodRefine<T, Mask>,
      options?: ZodRefineOptions<T>,
    ) => {
      const nullableSchema = nullable(schema.pick(mask));
      const currentSchema = nullableSchema.refine(
        refine as Parameters<(typeof nullableSchema)['refine']>[0],
        (output) => ({
          message:
            typeof options?.message === 'function'
              ? options.message(output as z.output<ZodObject<T>>)
              : options?.message,
          path: options?.path,
        }),
      );

      setSchema((s) => z.intersection(s, currentSchema));
    },
    [schema],
  );

  const addSuperRefine = useCallback(
    <
      Mask extends {
        [k in keyof T]?: true;
      },
    >(
      mask: Mask,
      superRefine: ZodSuperRefine<T, Mask>,
    ) => {
      const nullableSchema = nullable(schema.pick(mask));
      const currentSchema = nullableSchema.superRefine(
        superRefine as unknown as Parameters<(typeof nullableSchema)['refine']>[0],
      );

      setSchema((s) => z.intersection(s, currentSchema));
    },
    [schema],
  );

  return [defaultSchema as ZodObject<T>, { addRefine, addSuperRefine }] as const;
}

function nullable<TSchema extends z.AnyZodObject>(schema: TSchema) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  const entries = Object.entries(schema.shape) as [keyof TSchema['shape'], z.ZodTypeAny][];

  const newProps = entries.reduce(
    (acc, [key, value]) => {
      acc[key] = value.nullable();
      return acc;
    },
    {} as {
      [key in keyof TSchema['shape']]: z.ZodNullable<TSchema['shape'][key]>;
    },
  );

  return z.object(newProps);
}

export default useZodRefine;
