import resolveContextModels from '@foscia/core/actions/context/utilities/resolveContextModels';
import type { Action } from '@foscia/core/actions/types';
import { ParsedRawInclude, StandardizedEagerLoader } from '@foscia/core/relations/types';
import withParsedIncludeMap from '@foscia/core/relations/utilities/withParsedIncludeMap';

/**
 * Convert a standardized eager loader to a classic eager loader supporting
 * raw includes.
 *
 * @param eagerLoader
 *
 * @category Factories
 * @internal
 */
export default (
  eagerLoader: StandardizedEagerLoader['load'],
) => async (
  action: Action,
  relations: ParsedRawInclude[],
) => withParsedIncludeMap(
  action,
  await resolveContextModels(action),
  relations,
  (include) => eagerLoader(action, include),
);
