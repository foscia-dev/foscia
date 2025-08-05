import isModelPrimary from '@foscia/core/models/definition/utilities/isModelPrimary';
import { ModelInstance } from '@foscia/core/models/types';

/**
 * Get the primary dictionary for instance.
 *
 * @param instance
 *
 * @category Utilities
 */
export default function getPrimaryValues(instance: ModelInstance) {
  return Object.fromEntries(
    instance.$model.$schema.values()
      .filter(isModelPrimary)
      .map((prop) => [prop.key, prop.get(instance)] as const),
  );
}
