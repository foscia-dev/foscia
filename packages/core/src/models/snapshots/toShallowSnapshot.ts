import isModelPrimary from '@foscia/core/models/definition/utilities/isModelPrimary';
import strictOf from '@foscia/core/models/internals/strictOf';
import { ModelInstance, ModelShallowSnapshot, ModelSnapshot } from '@foscia/core/models/types';
import { SYMBOL_MODEL_SNAPSHOT } from '@foscia/core/symbols';

/**
 * Convert a snapshot to a shallow snapshot.
 *
 * @param snapshot
 *
 * @internal
 */
export default function toShallowSnapshot<I extends ModelInstance>(
  snapshot: ModelSnapshot<I>,
): ModelShallowSnapshot<I> {
  return {
    $FOSCIA_TYPE: SYMBOL_MODEL_SNAPSHOT,
    instance: snapshot.instance,
    exists: snapshot.exists,
    values: new Map(
      snapshot.values.entries().filter(
        ([key]) => isModelPrimary(
          strictOf(snapshot.instance).$model.$schema.get(key)!,
        ),
      ),
    ),
  };
}
