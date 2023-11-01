import cloneModelValue from '@foscia/core/model/snapshots/cloneModelValue';
import { ModelInstance, ModelSnapshot } from '@foscia/core/model/types';

export default function takeSnapshot<I extends ModelInstance>(
  instance: I,
): ModelSnapshot<I> {
  return {
    $model: instance.$model,
    $exists: instance.$exists,
    $raw: instance.$raw,
    $loaded: { ...instance.$loaded },
    $values: Object.entries(instance.$values).reduce((newValues, [key, value]) => ({
      ...newValues,
      [key]: cloneModelValue(instance.$model, value),
    }), {}),
  };
}
