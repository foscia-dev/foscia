import FosciaError from '@foscia/core/errors/fosciaError';
import {
  ReducedModel,
  ReducedModelCircularRef,
  ReducedModelInstance,
  ReducedModelInstanceData,
  ReducedModelSnapshot,
} from '@foscia/core/model/revivers/types';
import { Model, ModelInstance, ModelSnapshot } from '@foscia/core/model/types';
import { Dictionary, mapWithKeys, tap } from '@foscia/shared';

/**
 * Create a models reviver.
 *
 * @param options
 *
 * @category Factories
 * @since 0.8.6
 */
export default (options: { models: Model[]; }) => {
  let reviveInstance: (
    instance: ReducedModelInstance | ReducedModelCircularRef,
    parents: Map<string, ModelInstance>,
  ) => ModelInstance;

  const isReducedType = <T extends { $FOSCIA_TYPE: string; }>(
    type: T['$FOSCIA_TYPE'],
    value: unknown,
  ): value is T => !!value
    && typeof value === 'object'
    && '$FOSCIA_TYPE' in value
    && value.$FOSCIA_TYPE === type;

  const modelsMap = new Map(options.models.map((model) => [model.$type, model]));
  const reviveModel = (
    reducedModel: ReducedModel,
  ) => tap(modelsMap.get(reducedModel.$type), (model) => {
    if (!model) {
      throw new FosciaError(`Could not revive model with type \`${reducedModel.$type}\`.`);
    }
  })!;

  const reviveCircularRef = (
    ref: ReducedModelCircularRef,
    parents: Map<string, ModelInstance>,
  ) => tap(parents.get(ref.$ref), (instance) => {
    if (!instance) {
      throw new FosciaError('Could not revive not found instance, reduced data might be corrupted.');
    }
  })!;

  const reviveValue = (value: unknown, parents: Map<string, ModelInstance>): unknown => {
    if (Array.isArray(value)) {
      return value.map((item) => reviveValue(item, parents));
    }

    return isReducedType<ReducedModelInstance>('instance', value)
    || isReducedType<ReducedModelCircularRef>('circular', value)
      ? reviveInstance(value, parents)
      : value;
  };

  const reviveValues = (values: Dictionary, parents: Map<string, ModelInstance>) => mapWithKeys(
    values,
    (value, key) => ({ [key]: reviveValue(value, parents) }),
  );

  const reviveSnapshot = (snapshot: ReducedModelSnapshot, parents: Map<string, ModelInstance>) => ({
    $model: reviveModel(snapshot.$model),
    $exists: snapshot.$exists,
    $raw: snapshot.$raw,
    $loaded: snapshot.$loaded,
    $values: reviveValues(snapshot.$values, parents),
  }) as ModelSnapshot;

  const reviveInstanceData = (
    instance: ModelInstance,
    data: ReducedModelInstanceData,
    parents: Map<string, ModelInstance>,
  ) => {
    /* eslint-disable no-param-reassign */
    instance.$exists = data.$exists;
    instance.$raw = data.$raw;
    instance.$loaded = data.$loaded;
    instance.$values = reviveValues(data.$values, parents);
    instance.$original = reviveSnapshot(data.$original, parents);
    /* eslint-enable */
  };

  reviveInstance = (
    reducedInstance: ReducedModelInstance | ReducedModelCircularRef,
    parents: Map<string, ModelInstance>,
  ) => {
    if (reducedInstance.$FOSCIA_TYPE === 'circular') {
      return reviveCircularRef(reducedInstance, parents);
    }

    const RevivedModel = reviveModel(reducedInstance.$model);
    const instance = new RevivedModel();
    parents.set(reducedInstance.$ref, instance);

    if (reducedInstance.$data) {
      reviveInstanceData(instance, reducedInstance.$data, parents);
    }

    if (reducedInstance.$custom) {
      if (!('$revive' in instance) || typeof instance.$revive !== 'function') {
        throw new FosciaError(
          `Missing \`$revive\` method inside model with type \`${instance.$model.$type}\`.`,
        );
      }

      instance.$revive(reducedInstance.$custom, {
        revive: (
          i: ReducedModelInstance | ReducedModelCircularRef,
        ) => reviveInstance(i, parents),
      });
    }

    return instance;
  };

  return {
    revive: (
      instance: ReducedModelInstance,
    ) => reviveInstance(instance, new Map()),
  };
};
