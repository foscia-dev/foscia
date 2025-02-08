import makePropChainableFactory from '@foscia/core/model/props/builders/makePropChainableFactory';
import {
  ModelAssembledFactory,
  ModelAssembledFactoryConfig,
} from '@foscia/core/model/props/builders/types';
import { ModelPropSync } from '@foscia/core/model/types';
import { tap } from '@foscia/shared';

const assembled: {
  /**
   * Create an assembled property factory.
   *
   * @category Factories
   *
   * @since 0.13.0
   * @experimental
   *
   * @example
   * ```typescript
   * import { assembled } from '@foscia/core';
   *
   * assembled((user) => `${user.firstName} ${user.lastName}`);
   * ```
   */<T>(
    get: (instance: any) => T,
    config?: ModelAssembledFactoryConfig<T>,
  ): ModelAssembledFactory<T, true>;
  /**
   * Create an assembled property factory.
   *
   * @category Factories
   *
   * @since 0.13.0
   * @experimental
   *
   * @example
   * ```typescript
   * import { assembled } from '@foscia/core';
   *
   * assembled({
   *   get: (user) => `${user.firstName} ${user.lastName}`,
   *   set: (user, fullName) => {
   *     [user.firstName, user.lastName] = fullName.split(' ');
   *   },
   * });
   * ```
   */<T>(
    config: ModelAssembledFactoryConfig<T> & {
      get?: (instance: any) => T;
      set: (instance: any, value: T) => void;
    },
  ): ModelAssembledFactory<T, false>;
  /**
   * Create an assembled property factory.
   *
   * @category Factories
   *
   * @since 0.13.0
   * @experimental
   *
   * @example
   * ```typescript
   * import { assembled } from '@foscia/core';
   *
   * assembled({
   *   get: (user) => `${user.firstName} ${user.lastName}`,
   *   set: (user, fullName) => {
   *     [user.firstName, user.lastName] = fullName.split(' ');
   *   },
   * });
   * ```
   */<T>(
    config: ModelAssembledFactoryConfig<T> & {
      get?: (instance: any) => T;
    },
  ): ModelAssembledFactory<T, true>;
} = <T>(
  config: ((instance: any) => T) | (ModelAssembledFactoryConfig<T> & {
    get?: (instance: any) => T;
    set?: (instance: any, value: T) => void;
  }),
  otherConfig?: ModelAssembledFactoryConfig<T>,
) => {
  const { get, set, ...props } = (
    typeof config === 'function' ? { get: config, ...otherConfig } : config
  );

  return makePropChainableFactory({
    readOnly: !set,
    sync: false,
    memo: true,
    ...props,
    init(instance) {
      const noMemoSymbol = Symbol('');
      let memoValue = noMemoSymbol as unknown;

      const previousValues = new Map<PropertyKey, unknown>();

      const shouldCompute = () => (
        !this.memo || memoValue === noMemoSymbol || [...previousValues.entries()].some(
          ([key, value]) => !instance.$model.$config
            .compareSnapshotValues(value, Reflect.get(instance, key)),
        )
      );

      const compute = () => {
        previousValues.clear();

        memoValue = get!(new Proxy(instance, {
          get: (...params) => tap(
            Reflect.get(...params),
            (value) => previousValues.set(params[1], value),
          ),
        }));

        return memoValue;
      };

      Object.defineProperty(instance, this.key, {
        enumerable: true,
        get: get ? () => (shouldCompute() ? compute() : memoValue) : undefined,
        set: set ? (value) => set(instance, value) : undefined,
      });
    },
  }, {
    alias: (alias: string) => ({ alias }),
    sync: (sync?: boolean | ModelPropSync) => ({ sync: sync ?? true }),
    memo: (memo?: boolean) => ({ memo: memo ?? true }),
  }) as ModelAssembledFactory<T, any>;
};

export default assembled;
