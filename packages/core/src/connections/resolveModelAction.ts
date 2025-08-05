import resolveConnectionAction from '@foscia/core/connections/resolveConnectionAction';
import { Model } from '@foscia/core/models/types';

/**
 * Resolve an action factory for a model.
 *
 * @param model
 *
 * @internal
 */
export default function resolveModelAction(model: Model) {
  return resolveConnectionAction(model.$connection);
}
