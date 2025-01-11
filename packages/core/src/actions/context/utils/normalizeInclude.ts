import consumeRegistry from '@foscia/core/actions/context/consumers/consumeRegistry';
import guessContextModel from '@foscia/core/actions/context/guessers/guessContextModel';
import logger from '@foscia/core/logger/logger';
import normalizeDotRelations from '@foscia/core/normalization/normalizeDotRelations';
import { tap, using } from '@foscia/shared';

/**
 * Normalize the included dot relations.
 *
 * @param context
 * @param include
 *
 * @internal
 */
export default async (
  context: {},
  include: string[],
) => using(await guessContextModel(context), async (model) => (
  model
    ? using(
      await consumeRegistry(context, null),
      (registry) => normalizeDotRelations(model, include, registry),
    )
    : tap(include, () => logger.warn(
      'Could not detect model for context. Skipping include normalization.',
    ))
));
