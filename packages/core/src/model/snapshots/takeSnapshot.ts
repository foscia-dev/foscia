import cloneModelValue from '@foscia/core/model/snapshots/cloneModelValue';
import { ModelInstance, ModelSnapshot, ModelValues } from '@foscia/core/model/types';
import { mapWithKeys } from '@foscia/shared';

export default <I extends ModelInstance>(
  instance: I,
): ModelSnapshot<I> => ({
  $model: instance.$model,
  $exists: instance.$exists,
  $raw: instance.$raw,
  $loaded: { ...instance.$loaded },
  $values: mapWithKeys(instance.$values, (value, key) => {
    const clonedValue = cloneModelValue(instance.$model, value);

    return clonedValue !== undefined ? { [key]: clonedValue } : {};
  }) as Partial<ModelValues<I>>,
});
