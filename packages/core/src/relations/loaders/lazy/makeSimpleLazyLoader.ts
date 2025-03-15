import include from '@foscia/core/actions/context/enhancers/include';
import query from '@foscia/core/actions/context/enhancers/query';
import all from '@foscia/core/actions/context/runners/all';
import one from '@foscia/core/actions/context/runners/one';
import mergeEnhancers from '@foscia/core/actions/context/utilities/mergeEnhancers';
import when from '@foscia/core/actions/context/when';
import resolveModelRelationAction from '@foscia/core/connections/resolveModelRelationAction';
import isPluralRelation from '@foscia/core/model/props/checks/isPluralRelation';
import { ModelInstance } from '@foscia/core/model/types';
import makeStandardizedLazyLoader
  from '@foscia/core/relations/loaders/lazy/makeStandardizedLazyLoader';
import { ParsedIncludeMap } from '@foscia/core/relations/types';
import fillLoadedRelation from '@foscia/core/relations/utilities/fillLoadedRelation';

/**
 * Create a {@link StandardizedLazyLoader | `StandardizedLazyLoader`}
 * querying the relations for each instance.
 * Its implementation is simple but will cause performance issues when using
 * it on multiple instances or relations, as there will be one action run
 * for each instance/relation pair.
 *
 * @category Factories
 * @since 0.13.0
 */
export default () => makeStandardizedLazyLoader(async (
  instances: ModelInstance[],
  relations: ParsedIncludeMap,
) => {
  await Promise.all(instances.map(async (instance) => {
    await Promise.all(Array.from(relations, async ([relation, parsedInclude]) => {
      const action = await resolveModelRelationAction(relation);

      const customQuery = mergeEnhancers(parsedInclude.relationQuery, parsedInclude.customQuery);

      const value = await action(
        query(instance, relation.key, { query: null, include: null }),
        when(() => parsedInclude.include, include(parsedInclude.include!)),
        when(() => customQuery, customQuery!),
        when(isPluralRelation(relation), all(), one()),
      );

      fillLoadedRelation(instance, relation.key, value);
    }));
  }));
});
