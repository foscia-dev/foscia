import FosciaError from '@foscia/core/errors/fosciaError';
import runSyncHooks from '@foscia/core/hooks/runSyncHooks';
import assertModelInstancePrepared
  from '@foscia/core/models/definition/internals/assertModelInstancePrepared';
import {
  InferModelPropType,
  ModelInstance,
  ModelKey,
  ModelProp,
  ModelPropDecorator,
  ModelPropFeatures,
} from '@foscia/core/models/types';
import { SYMBOL_MODEL_PROP } from '@foscia/core/symbols';

/**
 * Create a model property decorator.
 *
 * @param factory
 *
 * @internal
 * @category Internals
 */
export default function makeModelPropDecorator<
  P extends ModelProp<T, This> = never,
  This extends ModelInstance = InstanceType<P['parent']>,
  T = InferModelPropType<P>,
>(
  factory: (data: Pick<P, Exclude<keyof ModelProp, 'kind' | keyof ModelPropFeatures>>) => P,
): ModelPropDecorator<This, T> {
  return (_target, context) => {
    context.addInitializer(function init() {
      if (context.name.startsWith('$')) {
        throw new FosciaError(
          'Properties starting with a `$` are forbidden because it is a reserved Foscia prefix.',
        );
      }

      assertModelInstancePrepared(this);

      const defaultValue = context.access.has(this) ? context.access.get(this) : undefined;

      Reflect.deleteProperty(this, context.name);

      if (!this.$model.$schema.has(context.name)) {
        const prop = factory({
          $FOSCIA_TYPE: SYMBOL_MODEL_PROP,
          parent: this.$model,
          key: context.name as ModelKey<This>,
          get: (instance) => {
            const readingHookEvent = { instance, prop, value: instance.$values.get(prop.key) };
            runSyncHooks(prop.parent, `property:reading:${prop.key}`, readingHookEvent as any);
            runSyncHooks(prop.parent, 'property:reading', readingHookEvent);

            const current = instance.$values.get(prop.key) as T;
            if (current === undefined && (
              prop.parent.$config.strictProperties ?? prop.parent.$config.strict ?? false
            )) {
              throw new FosciaError(
                `\`${prop.parent.$type}.${prop.key}\` value was not retrieved from the data source and model uses strict properties.`,
              );
            }

            const readHookEvent = { instance, prop, value: current };
            runSyncHooks(prop.parent, `property:read:${prop.key}`, readHookEvent as any);
            runSyncHooks(prop.parent, 'property:read', readHookEvent);

            return current;
          },
          set: (instance, next) => {
            const writeHookEvent = { instance, prop, prev: instance.$values.get(prop.key), next };

            runSyncHooks(prop.parent, `property:writing:${prop.key}`, writeHookEvent as any);
            runSyncHooks(prop.parent, 'property:writing', writeHookEvent);

            instance.$values.set(context.name, next);

            runSyncHooks(prop.parent, `property:write:${prop.key}`, writeHookEvent as any);
            runSyncHooks(prop.parent, 'property:write', writeHookEvent);
          },
          unset(instance) {
            instance.$values.delete(context.name);
          },
        });

        this.$model.$schema.set(context.name, prop);
      }

      if (defaultValue !== undefined) {
        this.$model.$schema.get(context.name)!.set(this, defaultValue);
      }
    });
  };
}
