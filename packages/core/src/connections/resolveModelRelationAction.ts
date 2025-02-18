import consumeRegistry from '@foscia/core/actions/context/consumers/consumeRegistry';
import guessContextModel from '@foscia/core/actions/context/guessers/guessContextModel';
import connections from '@foscia/core/connections/connections';
import resolveModelAction from '@foscia/core/connections/resolveModelAction';
import FosciaError from '@foscia/core/errors/fosciaError';
import { Model, ModelRelation } from '@foscia/core/model/types';
import { sequentialTransform } from '@foscia/shared';

/**
 * Resolve the action factory for a relation targeted model.
 *
 * @param relation
 *
 * @internal
 */
export default async (relation: ModelRelation) => {
  const foundModel = await sequentialTransform(
    [...connections.all().values()].map((factory) => async (model: Model | null) => (
      model ?? await guessContextModel({
        registry: consumeRegistry(await factory().useContext(), null),
        model: relation.parent,
        relation,
      })
    )),
    null,
  );
  if (foundModel) {
    return resolveModelAction(foundModel);
  }

  throw new FosciaError(
    `Connection for relation \`${relation.parent.$type}.${relation.key}\` could not be determined.`,
  );
};
