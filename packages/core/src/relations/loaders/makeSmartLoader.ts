import isActionFrom from '@foscia/core/actions/checks/isActionFrom';
import consumeLoader from '@foscia/core/actions/context/consumers/consumeLoader';
import context from '@foscia/core/actions/context/enhancers/context';
import { ActionFactory } from '@foscia/core/actions/types';
import resolveModelRelationAction from '@foscia/core/connections/resolveModelRelationAction';
import logger from '@foscia/core/logger/logger';
import { ModelInstance } from '@foscia/core/model/types';
import loaded from '@foscia/core/relations/loaded';
import { SmartLoaderConfig } from '@foscia/core/relations/loaders/types';
import { ParsedIncludeMap } from '@foscia/core/relations/types';
import makeParsedIncludeMapEagerLoader
  from '@foscia/core/relations/utilities/makeParsedIncludeMapEagerLoader';
import makeParsedIncludeMapLazyLoader
  from '@foscia/core/relations/utilities/makeParsedIncludeMapLazyLoader';
import { RelationsLoader } from '@foscia/core/types';
import { multimapSet, wrap } from '@foscia/shared';

/**
 * Compose a smart {@link RelationsLoader | `RelationsLoader`} to be included
 * inside an action factory.
 *
 * @param config
 *
 * @category Factories
 * @since 0.13.0
 *
 * @remarks
 * This loader implementation support multiple connections, loading only missing
 * relations, and delaying eager loading to lazy when eager loader does not
 * support queries or other sub features.
 */
export default (config: SmartLoaderConfig) => {
  const loader: RelationsLoader = {};
  const { eagerLoader, lazyLoader } = config;

  const lazyLoad = async (instances: ModelInstance[], relations: ParsedIncludeMap) => {
    const actionsByRelations = new Map<ActionFactory<{}>, ParsedIncludeMap>();
    await Promise.all(Array.from(relations, async ([relation, include]) => {
      const action = await resolveModelRelationAction(relation);
      multimapSet(actionsByRelations, [action, relation], include);
    }));

    await Promise.all(Array.from(actionsByRelations, async ([action, actionRelations]) => {
      const dedicatedLoader = await consumeLoader(action(), null);
      if (loader !== dedicatedLoader) {
        if (!dedicatedLoader?.lazyLoad) {
          logger.warn('Dedicated loader for action does not support lazy loading, skipping.');
        }

        await dedicatedLoader?.lazyLoad?.(instances, [actionRelations]);
      } else {
        await lazyLoader.load(instances, actionRelations);
      }
    }));
  };

  loader.lazyLoad = makeParsedIncludeMapLazyLoader(lazyLoad);

  const lazyLoadMissing = async (instances: ModelInstance[], relations: ParsedIncludeMap) => {
    // TODO Try to group lazyLoad when same instances are missing same relations.
    // TODO Try to group lazyLoadMissing when same related instances are missing sub-relations?
    await Promise.all(Array.from(relations, async ([relation, include]) => {
      const subRelations = new Map(include.include);

      const missingInstances = instances.filter((instance) => !loaded(instance, relation.key));
      if (missingInstances.length !== instances.length) {
        include.include.clear();
      }

      await lazyLoad(missingInstances, new Map([[relation, include]]));

      const related = instances.map((instance) => wrap(instance[relation.key])).flat();
      if (related.length && subRelations.size) {
        await lazyLoadMissing(related, subRelations);
      }
    }));
  };

  loader.lazyLoadMissing = makeParsedIncludeMapLazyLoader(lazyLoadMissing);

  loader.eagerLoad = makeParsedIncludeMapEagerLoader(async (action, relations) => {
    const delayedRelations: ParsedIncludeMap = new Map();

    const delayRelations = (
      includeMap: ParsedIncludeMap,
      delayedIncludeMap: ParsedIncludeMap,
    ) => Promise.all(Array.from(includeMap, async ([relation, include]) => {
      if (
        !await isActionFrom(action, await resolveModelRelationAction(relation))
        || (!eagerLoader.supportsQueries && (include.relationQuery || include.customQuery))
      ) {
        delayedIncludeMap.set(relation, include);
        includeMap.delete(relation);
      }
    }));

    await delayRelations(relations, delayedRelations);

    if (relations.size) {
      await eagerLoader.load(action, relations);
    }

    if (delayedRelations.size) {
      action(context({
        lazyEagerLoadCallback: (
          instances: ModelInstance[],
        ) => lazyLoadMissing(instances, delayedRelations),
      }));
    }
  });

  return {
    loader,
  };
};
