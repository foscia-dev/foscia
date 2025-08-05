import onPropertyRead from '@foscia/core/models/hooks/onPropertyRead';
import applyPropDefault from '@foscia/core/models/old/props/new/applyPropDefault';
import makeModelProp from '@foscia/core/models/old/props/new/makeModelProp';
import { ModelAccessor, ModelAccessorConfig, ModelKey } from '@foscia/core/models/types';
import { SYMBOL_MODEL_PROP_ACCESSOR } from '@foscia/core/symbols';

const accessor: {
  /**
   * Create an accessor property.
   *
   * @category Factories
   *
   * @since 0.13.0
   * @experimental
   *
   * @example
   * ```typescript
   * import { model, attr, accessor } from '@foscia/core';
   *
   * export default model(class {
   *   firstName = attr<string>();
   *   lastName = attr<string>();
   *   readonly fullName = accessor(() => `${this.firstName} ${this.lastName}`);
   * });
   * ```
   */<T>(
    get: () => T,
    config?: ModelAccessorConfig<T>,
  ): T;
  /**
   * Create an accessor property.
   *
   * @category Factories
   *
   * @since 0.13.0
   * @experimental
   *
   * @example
   * ```typescript
   * import { model, attr, accessor } from '@foscia/core';
   *
   * export default model(class {
   *   firstName = attr<string>();
   *   lastName = attr<string>();
   *   fullName = accessor({
   *     get: () => `${this.firstName} ${this.lastName}`,
   *     set: (fullName) => {
   *       [this.firstName, this.lastName] = fullName.split(' ');
   *     },
   *   );
   * });
   * ```
   */<T>(
    config: ModelAccessorConfig<T> & {
      get?: () => T;
      set: (value: T) => void;
    },
  ): T;
} = (
  getOrConfig: (() => unknown) | (ModelAccessorConfig<unknown> & {
    get?: () => unknown;
    set: (value: unknown) => void;
  }),
  configOrUndefined?: ModelAccessorConfig<unknown>,
) => {
  const NOT_MEMOIZED = Symbol('');

  const { get, set, ...config }: ModelAccessorConfig<unknown> & {
    get?: () => unknown;
    set?: (value: unknown) => void;
  } = typeof getOrConfig === 'function'
    ? { get: getOrConfig, ...configOrUndefined }
    : getOrConfig;

  return makeModelProp<ModelAccessor>(SYMBOL_MODEL_PROP_ACCESSOR, {
    ...config,
    init(instance, target) {
      const deps = new Map<ModelKey<typeof this.parent>, unknown>();
      let memoized = NOT_MEMOIZED as unknown;

      const needRecompute = () => (
        !this.memo
        || memoized === NOT_MEMOIZED
        || [...deps.entries()].some(
          ([k, v]) => !this.parent.$config.isSameSnapshotValue(v, this.parent[k]),
        )
      );

      const recompute = () => {
        deps.clear();

        const unregisterHook = onPropertyRead(this.parent, (event) => {
          if (event.instance === instance) {
            deps.set(event.prop.key, event.value);
          }
        });

        memoized = get!();

        unregisterHook();

        return memoized;
      };

      Object.defineProperty(target, this.key, {
        configurable: true,
        enumerable: true,
        get: get ? () => (needRecompute() ? recompute() : memoized) : undefined,
        set: set ? (value) => set(value) : undefined,
      });

      applyPropDefault(instance, this);
    },
  });
};

export default accessor;
