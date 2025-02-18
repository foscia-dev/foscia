import connections from '@foscia/core/connections/connections';
import { Model } from '@foscia/core/model/types';

/**
 * Resolve the action factory for a model.
 *
 * @param model
 *
 * @internal
 */
export default async (model: Model) => connections.get(model.$config.connection);
