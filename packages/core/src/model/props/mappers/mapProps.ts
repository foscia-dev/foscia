import {
  ModelAttribute,
  ModelId,
  ModelInstance,
  ModelKey,
  ModelRelation,
} from '@foscia/core/model/types';

export default function mapProps<I extends ModelInstance, R>(
  instance: I,
  callback: (
    def: ModelId<ModelKey<I>> | ModelAttribute<ModelKey<I>> | ModelRelation<ModelKey<I>>,
  ) => R,
  predicate?: (
    def: ModelId<ModelKey<I>> | ModelAttribute<ModelKey<I>> | ModelRelation<ModelKey<I>>,
  ) => boolean,
) {
  return Object.values(instance.$model.$schema).reduce((stack, def) => {
    if (!predicate || predicate(def)) {
      stack.push(callback(def));
    }

    return stack;
  }, [] as R[]);
}
