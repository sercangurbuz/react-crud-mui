import { useCallback, useState } from 'react';

import hash from 'object-hash';
import { RefinementCtx, util, z, ZodIssueBase, ZodObject, ZodRawShape, ZodTypeAny } from 'zod';

import { isPromise } from '../misc/isPromise';
import nullable from '../misc/nullableSchema';

export interface UseZodRefineOptions<T extends ZodRawShape> {
  schema: ZodObject<T>;
  enableMemoizedRefine?: boolean;
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
  (arg: z.output<ZodObject<Pick<T, Extract<keyof T, keyof Mask>>>>): boolean | Promise<boolean>;
}

export interface ZodSuperRefine<
  T extends ZodRawShape,
  Mask extends {
    [k in keyof T]?: true;
  },
> {
  (arg: z.output<ZodObject<Pick<T, Extract<keyof T, keyof Mask>>>>, ctx: RefinementCtx): void;
}

function useZodRefine<T extends ZodRawShape>({
  schema,
  enableMemoizedRefine = true,
}: UseZodRefineOptions<T>) {
  const [defaultSchema, setSchema] = useState<ZodTypeAny>(schema);

  const addRefine = useCallback(
    <
      Mask extends util.Exactly<
        {
          [k in keyof T]?: true;
        },
        Mask
      >,
    >(
      mask: Mask,
      refine: ZodRefine<T, Mask>,
      options?: ZodRefineOptions<T>,
    ) => {
      const nullableSchema = nullable(schema.pick(mask));

      let payloadHash: string | undefined;
      let prevResult: boolean | undefined;

      const currentSchema = nullableSchema.refine(
        async (payload) => {
          if (enableMemoizedRefine) {
            const hashKey = hash(payload);

            if (payloadHash === hashKey) {
              return prevResult;
            }
            payloadHash = hashKey;
          }

          const result = refine(payload);

          if (enableMemoizedRefine) {
            prevResult = isPromise(result) ? await result : result;
          }

          return result;
        },

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
    [enableMemoizedRefine, schema],
  );

  const addSuperRefine = useCallback(
    <
      Mask extends util.Exactly<
        {
          [k in keyof T]?: true;
        },
        Mask
      >,
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

export default useZodRefine;
