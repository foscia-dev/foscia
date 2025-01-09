/**
 * Dictionary of type.
 *
 * @internal
 */
export type Dictionary<T = unknown> = { [K: string]: T };

/**
 * Constructor of type.
 *
 * @internal
 */
export type Constructor<T> = new (...args: any[]) => T;

/**
 * Utility for recursive types.
 *
 * @internal
 */
export type Prev = [never, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];

/**
 * Infer type from function return value if it is a function.
 *
 * @internal
 */
export type Value<T> = T extends (...args: any[]) => any ? ReturnType<T> : T;

/**
 * Type which can be awaited or not.
 *
 * @internal
 */
export type Awaitable<T> = T | Promise<T>;

/**
 * Type which can be an array or not.
 *
 * @internal
 */
export type Arrayable<T> = T[] | T;

/**
 * Type which can be an array or not, as a variadic parameter.
 *
 * @internal
 */
export type ArrayableVariadic<T> = T[] | [T[]];

/**
 * Type which can be null or undefined.
 *
 * @internal
 */
export type Optional<T> = T | null | undefined;

/**
 * Types considered `false` by JavaScript.
 *
 * @internal
 */
export type Falsy = null | undefined | false | 0 | -0 | 0n | '';

/**
 * Only truthy types from `T`.
 *
 * @internal
 */
export type OnlyTruthy<T> = T extends Falsy ? never : T;

/**
 * Only falsy types from `T`.
 *
 * @internal
 */
export type OnlyFalsy<T> = T extends Falsy ? T : never;

/**
 * Transformer function from a type to another.
 *
 * @internal
 */
export type Transformer<T, U = T> = (value: T) => U;

/**
 * Exclude properties with types `never` from object type.
 *
 * @internal
 */
export type OmitNever<T> = {
  [K in keyof T as T[K] extends never ? never : K]: T[K]
};

/**
 * Convert a union type to intersection.
 *
 * @internal
 */
export type UnionToIntersection<U> =
  (U extends any ? (x: U) => void : never) extends ((x: infer I) => void) ? I : never;

/**
 * Middleware next callback.
 *
 * @internal
 */
export type MiddlewareNext<V, R> = (value: V) => R;

/**
 * Middleware callback.
 *
 * @internal
 */
export type Middleware<V, R> = (value: V, next: MiddlewareNext<V, R>) => R;

/**
 * Map identifier with type.
 *
 * @internal
 */
export type IdentifiersMap<Type, Id, T> = {
  find: (type: Type, id: Id) => T | null;
  put: (type: Type, id: Id, value: T) => void;
  forget: (type: Type, id: Id) => void;
  forgetAll: (type: Type) => void;
  clear: () => void;
};

/**
 * Foscia object which can be identified by a unique symbol.
 *
 * @internal
 */
export type FosciaObject<S extends symbol> = {
  /**
   * Type of the Foscia object.
   *
   * @internal
   */
  readonly $FOSCIA_TYPE: S;
};
