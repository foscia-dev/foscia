export type Dictionary<T = unknown> = { [K: string]: T };

export type Constructor<T> = new (...args: any[]) => T;

export type Prev = [never, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];

export type Value<T> = T extends (...args: any[]) => any ? ReturnType<T> : T;

export type Awaitable<T> = T | Promise<T>;

export type Arrayable<T> = T[] | T;

export type ArrayableVariadic<T> = T[] | [T[]];

export type Optional<T> = T | null | undefined;

export type Falsy = null | undefined | false | 0 | -0 | 0n | '';

export type OnlyTruthy<T> = T extends Falsy ? never : T;

export type OnlyFalsy<T> = T extends Falsy ? T : never;

export type Transformer<T, U = T> = (value: T) => U;

export type IdentifiersMap<Type, Id, T> = {
  find: (type: Type, id: Id) => T | null;
  put: (type: Type, id: Id, value: T) => void;
  forget: (type: Type, id: Id) => void;
  forgetAll: (type: Type) => void;
  clear: () => void;
};

export type FosciaObject<Symbol> = {
  $FOSCIA_TYPE: Symbol;
};
