import isInstance from '@foscia/core/model/checks/isInstance';
import isSnapshot from '@foscia/core/model/checks/isSnapshot';
import {
  ModelsReducerConfig,
  ReducedModel,
  ReducedModelCircularRef,
  ReducedModelInstance,
  ReducedModelInstanceCustomData,
  ReducedModelInstanceData,
  ReducedModelSnapshot,
  ReducerParentsMap,
  ReducerReferenceable,
  ReviverDereferenceable,
} from '@foscia/core/model/revivers/types';
import {
  Model,
  ModelInstance,
  ModelLimitedSnapshot,
  ModelSnapshot,
} from '@foscia/core/model/types';
import { Dictionary, mapWithKeys, uniqueId, unsafeId, using } from '@foscia/shared';

/**
 * Create a models reducer.
 *
 * @category Factories
 * @since 0.8.6
 */
export default (config: ModelsReducerConfig = {}) => {
  let reduceInstance: (
    instance: ModelInstance,
    parents: ReducerParentsMap,
  ) => ReducedModelInstance | ReducedModelCircularRef;
  let reduceSnapshot: (
    snapshot: ModelSnapshot | ModelLimitedSnapshot,
    parents: ReducerParentsMap,
  ) => ReducedModelSnapshot | ReducedModelCircularRef;

  const generateRef = (refs: string[]): string => uniqueId(unsafeId, refs);

  const reduceCircularRef = (ref: string) => ({
    $FOSCIA_TYPE: 'circular',
    $ref: ref,
  } as ReducedModelCircularRef);

  const reduceModel = (model: Model) => ({
    $FOSCIA_TYPE: 'model',
    $type: model.$type,
  } as ReducedModel);

  const reduceValue = (value: unknown, parents: ReducerParentsMap): unknown => {
    if (Array.isArray(value)) {
      return value.map((item) => reduceValue(item, parents));
    }

    if (isInstance(value)) {
      return reduceInstance(value, parents);
    }

    if (isSnapshot(value)) {
      return reduceSnapshot(value, parents);
    }

    return config.reduce ? config.reduce(value) : value;
  };

  const reduceValues = (values: Dictionary, parents: ReducerParentsMap) => mapWithKeys(
    values,
    (value, key) => ({ [key]: reduceValue(value, parents) }),
  );

  const reduceInstanceData = (instance: ModelInstance, parents: ReducerParentsMap) => ({
    $exists: instance.$exists,
    $raw: instance.$raw,
    $loaded: instance.$loaded,
    $values: reduceValues(instance.$values, parents),
    $original: reduceSnapshot(instance.$original, parents) as ReducedModelSnapshot,
  });

  const makeReferenceableReducer = <
    T extends ReducerReferenceable,
    U extends ReviverDereferenceable,
  >(
    reducer: (value: T, ref: string, parents: ReducerParentsMap) => U,
  ) => (
    value: T,
    parents: ReducerParentsMap,
  ) => using(parents.get(value), (prevRef) => (
    prevRef !== undefined
      ? reduceCircularRef(prevRef)
      : using(
        generateRef([...parents.values()]),
        (ref) => {
          parents.set(value, ref);
          return reducer(value, ref, parents);
        },
      )
  ));

  reduceSnapshot = makeReferenceableReducer(
    (snapshot: ModelSnapshot | ModelLimitedSnapshot, ref, parents): ReducedModelSnapshot => ({
      $FOSCIA_TYPE: 'snapshot',
      $ref: ref,
      $instance: reduceInstance(snapshot.$instance, parents),
      $exists: snapshot.$exists,
      $values: reduceValues(snapshot.$values, parents),
      ...('$raw' in snapshot ? {
        $raw: snapshot.$raw,
        $loaded: snapshot.$loaded,
      } : {}),
    }),
  );

  reduceInstance = makeReferenceableReducer(
    (instance: ModelInstance, ref, parents): ReducedModelInstance => {
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
        $ref: ref,
        $model: reduceModel(instance.$model),
        $data: data,
        $custom: custom,
      };
    },
  );

  return {
    reduce: (
      instance: ModelInstance,
    ) => reduceInstance(instance, new Map()) as ReducedModelInstance,
  };
};
