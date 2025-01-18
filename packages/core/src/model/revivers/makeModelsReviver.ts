import FosciaError from '@foscia/core/errors/fosciaError';
import {
  ModelsReviverConfig,
  ReducedModel,
  ReducedModelCircularRef,
  ReducedModelInstance,
  ReducedModelInstanceData,
  ReducedModelSnapshot,
  ReducerReferenceable,
  ReviverDereferenceable,
  ReviverParentsMap,
} from '@foscia/core/model/revivers/types';
import { ModelInstance, ModelLimitedSnapshot, ModelSnapshot } from '@foscia/core/model/types';
import { SYMBOL_MODEL_SNAPSHOT } from '@foscia/core/symbols';
import { Dictionary, mapWithKeys, tap, using } from '@foscia/shared';

/**
 * Create a models reviver.
 *
 * @param config
 *
 * @category Factories
 * @since 0.8.6
 */
export default (config: ModelsReviverConfig) => {
  let reviveInstance: (
    instance: ReducedModelInstance | ReducedModelCircularRef,
    parents: ReviverParentsMap,
  ) => ModelInstance;
  let reviveSnapshot: (
    snapshot: ReducedModelSnapshot | ReducedModelCircularRef,
    parents: ReviverParentsMap,
  ) => ModelSnapshot | ModelLimitedSnapshot;

  const isReducedType = <T extends { $FOSCIA_TYPE: string; }>(
    type: T['$FOSCIA_TYPE'],
    value: unknown,
  ): value is T => !!value
    && typeof value === 'object'
    && '$FOSCIA_TYPE' in value
    && value.$FOSCIA_TYPE === type;

  const modelsMap = new Map(config.models.map((model) => [model.$type, model]));
  const reviveModel = (
    reducedModel: ReducedModel,
  ) => tap(modelsMap.get(reducedModel.$type), (model) => {
    if (!model) {
      throw new FosciaError(`Could not revive model with type \`${reducedModel.$type}\`.`);
    }
  })!;

  const reviveCircularRef = (
    ref: ReducedModelCircularRef,
    parents: ReviverParentsMap,
  ) => tap(parents.get(ref.$ref), (instance) => {
    if (!instance) {
      throw new FosciaError('Could not revive not found ref, reduced data might be corrupted.');
    }
  })!;

  const reviveValue = (value: unknown, parents: ReviverParentsMap): unknown => {
    if (Array.isArray(value)) {
      return value.map((item) => reviveValue(item, parents));
    }

    if (isReducedType<ReducedModelCircularRef>('circular', value)) {
      return reviveCircularRef(value, parents);
    }

    if (isReducedType<ReducedModelInstance>('instance', value)) {
      return reviveInstance(value, parents);
    }

    if (isReducedType<ReducedModelSnapshot>('snapshot', value)) {
      return reviveSnapshot(value, parents);
    }

    return config.revive ? config.revive(value) : value;
  };

  const reviveValues = (values: Dictionary, parents: ReviverParentsMap) => mapWithKeys(
    values,
    (value, key) => ({ [key]: reviveValue(value, parents) }),
  );

  const reviveInstanceData = (
    instance: ModelInstance,
    data: ReducedModelInstanceData,
    parents: ReviverParentsMap,
  ) => {
    /* eslint-disable no-param-reassign */
    instance.$exists = data.$exists;
    instance.$raw = data.$raw;
    instance.$loaded = data.$loaded;
    instance.$values = reviveValues(data.$values, parents);
    instance.$original = reviveSnapshot(data.$original, parents) as ModelSnapshot;
    /* eslint-enable */
  };

  const makeReferenceableReviver = <
    T extends ReviverDereferenceable,
    U extends ReducerReferenceable,
  >(
    reviver: (value: T) => U,
    hydrator: (value: T, revived: U, parents: ReviverParentsMap) => void,
  ) => (
    value: T | ReducedModelCircularRef,
    parents: ReviverParentsMap,
  ) => (
    isReducedType<ReducedModelCircularRef>('circular', value)
      ? reviveCircularRef(value, parents)
      : tap(reviver(value), (revived) => {
        parents.set(value.$ref, revived);
        hydrator(value, revived, parents);
      })
  ) as U;

  reviveSnapshot = makeReferenceableReviver(
    (value: ReducedModelSnapshot) => ({
      $FOSCIA_TYPE: SYMBOL_MODEL_SNAPSHOT,
      $exists: value.$exists,
      $instance: null as any,
      $values: null as any,
      ...('$raw' in value ? {
        $original: null,
        $raw: value.$raw,
        $loaded: value.$loaded,
      } : {}),
    }),
    (value: ReducedModelSnapshot, snapshot: ModelSnapshot | ModelLimitedSnapshot, parents) => {
      /* eslint-disable no-param-reassign */
      // @ts-ignore
      snapshot.$values = reviveValues(value.$values, parents);
      // @ts-ignore
      snapshot.$instance = reviveInstance(value.$instance, parents);
      if ('$raw' in value && value.$original) {
        // @ts-ignore
        snapshot.$original = reviveSnapshot(value.$original, parents);
      }
      /* eslint-enable */
    },
  );

  reviveInstance = makeReferenceableReviver(
    (value: ReducedModelInstance) => using(
      reviveModel(value.$model),
      (RevivedModel) => new RevivedModel(),
    ),
    (value: ReducedModelInstance, instance: ModelInstance, parents) => {
      if (value.$data) {
        reviveInstanceData(instance, value.$data, parents);
      }

      if (value.$custom) {
        if (!('$revive' in instance) || typeof instance.$revive !== 'function') {
          throw new FosciaError(
            `Missing \`$revive\` method inside model with type \`${instance.$model.$type}\`.`,
          );
        }

        instance.$revive(value.$custom, {
          revive: (
            i: ReducedModelInstance | ReducedModelCircularRef,
          ) => reviveInstance(i, parents),
        });
      }
    },
  );

  return {
    revive: (
      instance: ReducedModelInstance,
    ) => reviveInstance(instance, new Map()),
  };
};
