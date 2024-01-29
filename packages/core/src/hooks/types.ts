import { Awaitable, Dictionary } from '@foscia/shared';

export type SyncHookCallback<E> = (event: E) => void;

export type HookCallback<E> = (event: E) => Awaitable<void>;

export type HooksDefinition = Dictionary<HookCallback<any>>;

export type HooksRegistrar<D extends HooksDefinition> = {
  [K in keyof D]?: D[K][];
};

export type Hookable<D extends HooksDefinition> = {
  $hooks: HooksRegistrar<D> | null;
};
