import { ModelInstance } from '@foscia/core/model/types';

/**
 * Check if instance contains any values, even defined as null. It excludes ID
 * and LID from checked values.
 * This can be useful to check if any data has been loaded on an instance from
 * the store. If no attributes/relations are declared on model, it will always
 * return true.
 *
 * @param instance
 */
export default function filled(instance: ModelInstance) {
  return Object.keys(instance.$model.$schema).length <= 2
    || Object.keys(instance.$values).some(
      (key) => (key !== 'id' && key !== 'lid' && instance.$values[key] !== undefined),
    );
}
