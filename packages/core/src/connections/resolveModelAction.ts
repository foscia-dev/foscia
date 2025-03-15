import resolveConnectionAction from '@foscia/core/connections/resolveConnectionAction';
import { Model } from '@foscia/core/model/types';

/**
 * Resolve the action factory for a model.
 *
 * @param model
 *
 * @category Utilities
 * @internal
 */
export default (model: Model) => resolveConnectionAction(model.$connection);
