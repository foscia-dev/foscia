import isInstance from '@foscia/core/model/checks/isInstance';
import {
  ReducedModel,
  ReducedModelCircularRef,
  ReducedModelInstance,
  ReducedModelInstanceCustomData,
  ReducedModelInstanceData,
  ReducedModelSnapshot,
} from '@foscia/core/model/revivers/types';
import { Model, ModelInstance, ModelSnapshot } from '@foscia/core/model/types';
import { Dictionary, mapWithKeys, uniqueId, unsafeId } from '@foscia/shared';

/**
 * Create a models reducer.
 *
 * @category Factories
 * @since 0.8.6
 */
export default () => {
  let reduceInstance: (
    instance: ModelInstance,
    parents: Map<ModelInstance, string>,
  ) => ReducedModelInstance | ReducedModelCircularRef;

  const generateRef = (refs: string[]): string => uniqueId(unsafeId, refs);

  const reduceModel = (model: Model) => ({
    $FOSCIA_TYPE: 'model',
    $type: model.$type,
  } as ReducedModel);

  const reduceCircularRef = (ref: string) => ({
    $FOSCIA_TYPE: 'circular',
    $ref: ref,
  } as ReducedModelCircularRef);

  const reduceValue = (value: unknown, parents: Map<ModelInstance, string>): unknown => {
    if (Array.isArray(value)) {
      return value.map((item) => reduceValue(item, parents));
    }

    if (isInstance(value)) {
      return reduceInstance(value, parents);
    }

    return value;
  };

  const reduceValues = (values: Dictionary, parents: Map<ModelInstance, string>) => mapWithKeys(
    values,
    (value, key) => ({ [key]: reduceValue(value, parents) }),
  );

  const reduceSnapshot = (snapshot: ModelSnapshot, parents: Map<ModelInstance, string>) => ({
    $FOSCIA_TYPE: 'snapshot',
    $model: reduceModel(snapshot.$model),
    $exists: snapshot.$exists,
    $raw: snapshot.$raw,
    $loaded: snapshot.$loaded,
    $values: reduceValues(snapshot.$values, parents),
  } as ReducedModelSnapshot);

  const reduceInstanceData = (instance: ModelInstance, parents: Map<ModelInstance, string>) => ({
    $exists: instance.$exists,
    $raw: instance.$raw,
    $loaded: instance.$loaded,
    $values: reduceValues(instance.$values, parents),
    $original: reduceSnapshot(instance.$original, parents),
  });

  reduceInstance = (instance: ModelInstance, parents: Map<ModelInstance, string>) => {
    let reference = parents.get(instance);
    if (reference !== undefined) {
      return reduceCircularRef(reference);
    }

    reference = generateRef([...parents.values()]);
    parents.set(instance, reference);

    let data: ReducedModelInstanceData | undefined;
    let custom: ReducedModelInstanceCustomData | undefined;
    if ('$reduce' in instance && typeof instance.$reduce === 'function') {
      custom = instance.$reduce({
        reduce: (i: ModelInstance) => reduceInstance(i, parents),
        data: (i: ModelInstance) => ({ $data: reduceInstanceData(i, parents) }),
      }) as ReducedModelInstanceCustomData;
      data = custom.$data;
    } else {
      data = reduceInstanceData(instance, parents);
    }

    return {
      $FOSCIA_TYPE: 'instance',
      $model: reduceModel(instance.$model),
      $ref: reference,
      $data: data,
      $custom: custom,
    };
  };

  return {
    reduce: (
      instance: ModelInstance,
    ) => reduceInstance(instance, new Map()) as ReducedModelInstance,
  };
};
