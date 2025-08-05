import mergeEnhancers from '@foscia/core/actions/context/utilities/mergeEnhancers';
import parseConnectionType from '@foscia/core/connections/parseConnectionType';
import FosciaError from '@foscia/core/errors/fosciaError';
import makeHookable from '@foscia/core/hooks/makeHookable';
import runSyncHooks from '@foscia/core/hooks/runSyncHooks';
import applyComposables from '@foscia/core/models/definition/internals/applyComposables';
import assertModelInstancePrepared
  from '@foscia/core/models/definition/internals/assertModelInstancePrepared';
import makeObjectPropertyDefiner
  from '@foscia/core/models/definition/internals/makeObjectPropertyDefiner';
import {
  Model,
  ModelClassDecoratorFactory,
  ModelComposableDecorator,
  ModelConfig,
  ModelInstance,
} from '@foscia/core/models/types';
import cloneModelValue from '@foscia/core/models/utilities/cloneModelValue';
import isSameModelValue from '@foscia/core/models/utilities/isSameModelValue';
import modelRegistry from '@foscia/core/models/modelRegistry';
import { SYMBOL_MODEL_CLASS } from '@foscia/core/symbols';
import { Constructor } from '@foscia/shared/index';

/* eslint-disable no-param-reassign */

/**
 * Create a model decorator.
 *
 * @param sharedConfig
 *
 * @category Factories
 * @since 0.13.0
 *
 * @example
 * ```typescript
 * import { makeModelDecorator } from '@foscia/core';
 *
 * const model = makeModelDecorator({
 *   guessType: (name) => plural(kebab(name)),
 * });
 *
 * @model()
 * class Post extends model.base() {
 * }
 * ```
 */
export default function makeModel<SharedComposable extends ModelComposableDecorator = never>(
  sharedConfig?: Partial<{
    /**
     * Shared composables to use for models.
     */
    composables: SharedComposable[];
    /**
     * Shared connection to use for models.
     */
    connection: string;
    /**
     * Guess model type from the class name.
     *
     * @param type
     */
    guessType: (type: string) => string;
  } & ModelConfig<ModelInstance>>,
): ModelClassDecoratorFactory<SharedComposable> {
  const decorator = (
    dedicatedConfig?: string | ModelComposableDecorator[] | Partial<{
      connection: string;
      type: string;
    } & ModelConfig<ModelInstance>>,
    dedicatedComposables: ModelComposableDecorator[] = [],
  ) => (
    target: Constructor,
    context?: ClassDecoratorContext<Constructor>,
  ) => {
    const { composables, connection, type, ...config } = (() => {
      const sharedComposables = sharedConfig?.composables ?? [];

      if (typeof dedicatedConfig === 'string') {
        return {
          ...sharedConfig,
          ...parseConnectionType(dedicatedConfig, sharedConfig?.connection),
          composables: [...sharedComposables, ...dedicatedComposables],
        };
      }

      const [parsedDedicatedConfig, parsedDedicatedComposables] = Array.isArray(dedicatedConfig)
        ? [{}, dedicatedConfig]
        : [dedicatedConfig, []];

      return {
        ...sharedConfig,
        ...dedicatedConfig,
        composables: [...sharedComposables, ...parsedDedicatedComposables],
        query: mergeEnhancers(sharedConfig?.query, parsedDedicatedConfig?.query) ?? undefined,
        connection: parsedDedicatedConfig?.connection ?? sharedConfig?.connection ?? 'default',
        type: parsedDedicatedConfig?.type
          ?? (context?.name && sharedConfig?.guessType?.(context?.name))
          ?? context?.name,
      };
    })();

    if (!type) {
      throw new FosciaError('Model type is required.');
    }

    const initModelClass = (instance: object) => {
      assertModelInstancePrepared(instance);

      instance.$initializers.forEach((init) => init(instance));

      if (!instance.$model.$booted) {
        instance.$model.$introspecting = false;
        runSyncHooks(instance.$model, 'boot', instance.$model);
        instance.$model.$booted = true;
      }

      runSyncHooks(instance.$model, 'init', instance);
    };

    const ModelClass = class extends target {
      constructor(...args: any[]) {
        super(...args);
        initModelClass(this);
      }
    };

    const defineModelProperty = makeObjectPropertyDefiner<Model>(ModelClass);

    defineModelProperty('$FOSCIA_TYPE', SYMBOL_MODEL_CLASS);
    defineModelProperty('$connection', connection);
    defineModelProperty('$type', type);
    defineModelProperty('$config', {
      compareSnapshotValues: isSameModelValue,
      isSameSnapshotValue: isSameModelValue,
      cloneSnapshotValue: cloneModelValue,
      ...config,
    });
    defineModelProperty('$introspecting', false, { writable: true });
    defineModelProperty('$booted', false, { writable: true });
    Object.defineProperty(ModelClass, '$schema', {
      configurable: true,
      get() {
        // eslint-disable-next-line no-new
        new this();

        return this.$schema;
      },
    });

    const composedModel = applyComposables(composables, makeHookable(ModelClass));

    modelRegistry.set(composedModel);

    return composedModel;
  };

  return makeHookable(Object.assign(decorator, {
    base: <DedicatedComposable extends ModelComposableDecorator = never>(
      composables?: DedicatedComposable[],
    ) => applyComposables(composables ?? []),
  })) as any;
}
