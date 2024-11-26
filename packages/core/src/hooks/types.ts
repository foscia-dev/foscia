import { Arrayable, Awaitable, Dictionary } from '@foscia/shared';

/**
 * Synchronous hook callback.
 *
 * @internal
 */
export type SyncHookCallback<E> = (event: E) => void;

/**
 * Asynchronous hook callback.
 *
 * @internal
 */
export type HookCallback<E> = (event: E) => Awaitable<void>;

/**
 * Hooks definition object.
 *
 * @internal
 */
export type HooksDefinition = Dictionary<HookCallback<any>>;

/**
 * Hooks unparsed registrar for a definition.
 *
 * @internal
 */
export type HooksRawRegistrar<D extends HooksDefinition> = {
  [K in keyof D]?: Arrayable<D[K]>;
};

/**
 * Hooks parsed registrar for a definition.
 *
 * @internal
 */
export type HooksRegistrar<D extends HooksDefinition> = {
  [K in keyof D]?: D[K][];
};

/**
 * Object on which hooks can be bound and triggered.
 *
 * @internal
 */
export type Hookable<D extends HooksDefinition> = {
  /**
   * Currently registered hooks.
   *
   * @internal
   */
  $hooks: HooksRegistrar<D> | null;
};
