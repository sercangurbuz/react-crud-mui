export type ServerError = {
  message?: string;
  [key: string]: any;
};

export type DeepPartial<T> = {
  [K in keyof T]: DeepPartial<T[K]> | null | undefined;
};

export type DeepNullable<T> = {
  [K in keyof T]: DeepNullable<T[K]> | null;
};

export type Nullable<T> = { [K in keyof T]: T[K] | null };

export type ControlledFormProps<T = RecordType> = {
  value?: T;
  onChange?(value?: T): void;
};

export type EnumObj = Record<string, string>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type RecordType = Record<string, any>;

export type RecursivePartial<T> = {
  [P in keyof T]?: T[P] extends (infer U)[]
    ? RecursivePartial<U>[]
    : T[P] extends object
      ? RecursivePartial<T[P]>
      : T[P];
};

export type ArrayElement<ArrayType extends readonly unknown[]> =
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

export type KnownKeys<T> = {
  [K in keyof T]: string extends K ? never : number extends K ? never : K;
} extends { [_ in keyof T]: infer U }
  ? U
  : never;
