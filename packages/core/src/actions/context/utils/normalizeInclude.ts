import consumeRegistry from '@foscia/core/actions/context/consumers/consumeRegistry';
import guessContextModel from '@foscia/core/actions/context/guessers/guessContextModel';
import logger from '@foscia/core/logger/logger';
import normalizeDotRelations from '@foscia/core/normalization/normalizeDotRelations';

export default async function normalizeInclude(
  context: {},
  include: string[],
) {
  const model = await guessContextModel(context, true);
  if (model) {
    return normalizeDotRelations(model, include, consumeRegistry(context, null));
  }

  logger.warn(
    'Could not detect model for context. Skipping include normalization.',
  );

  return include;
}
