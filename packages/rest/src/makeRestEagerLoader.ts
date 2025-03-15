import {
  Action,
  aliasPropKey,
  logger,
  makeStandardizedEagerLoader,
  ParsedIncludeMap,
  walkParsedIncludeMap,
} from '@foscia/core';
import { param } from '@foscia/http';
import { RestEagerLoaderConfig } from '@foscia/rest/types';

/**
 * Create a REST eager relations loader to bind included relations to a string
 * query parameter (e.g. `with=tags,author.avatar`).
 *
 * @category Factories
 * @since 0.13.0
 *
 * @remarks
 * This loader does not support eager loading with custom queries.
 */
export default (
  config: RestEagerLoaderConfig,
) => makeStandardizedEagerLoader(async (action: Action, relations: ParsedIncludeMap) => {
  const keys = new Set<string>();
  await walkParsedIncludeMap(relations, async (relation, parsedInclude, ancestors) => {
    if (parsedInclude.relationQuery || parsedInclude.customQuery) {
      logger.warn('Eager loader does not support sub-actions queries.');
    }

    if (parsedInclude.requested) {
      keys.add([...ancestors, [relation]].map((a) => aliasPropKey(a[0])).join('.'));
    }
  });

  action(param(config.param, [...keys].join(',')));
}, { supportsQueries: false });
