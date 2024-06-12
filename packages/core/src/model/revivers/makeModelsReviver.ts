import FosciaError from '@foscia/core/errors/fosciaError';
import {
  ReducedModel,
  ReducedModelCircularRef,
  ReducedModelInstance,
  ReducedModelInstanceData,
  ReducedModelSnapshot,
} from '@foscia/core/model/revivers/types';
import { Model, ModelInstance, ModelSnapshot } from '@foscia/core/model/types';
import { Dictionary } from '@foscia/shared';

export default function makeModelsReviver(options: { models: Model[]; }) {
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
  const reviveModel = (reducedModel: ReducedModel) => {
    const model = modelsMap.get(reducedModel.$type);
    if (!model) {
      throw new FosciaError(`Could not revive model with type \`${reducedModel.$type}\`.`);
    }

    return model;
  };

  const reviveCircularRef = (ref: ReducedModelCircularRef, parents: Map<string, ModelInstance>) => {
    const instance = parents.get(ref.$ref);
    if (!instance) {
      throw new FosciaError('Could not revive not found instance, reduced data might be corrupted.');
    }

    return instance;
  };

  const reviveValue = (value: unknown, parents: Map<string, ModelInstance>): unknown => {
    if (Array.isArray(value)) {
      return value.map((item) => reviveValue(item, parents));
    }

    if (
      isReducedType<ReducedModelInstance>('instance', value)
      || isReducedType<ReducedModelCircularRef>('circular', value)
    ) {
      return reviveInstance(value, parents);
    }

    return value;
  };

  const reviveValues = (values: Dictionary, parents: Map<string, ModelInstance>) => Object
    .entries(values)
    .reduce((reduced, [key, value]) => ({
      ...reduced,
      [key]: reviveValue(value, parents),
    }), {} as Dictionary);

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
}
