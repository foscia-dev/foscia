import include from '@foscia/core/actions/context/enhancers/include';
import query from '@foscia/core/actions/context/enhancers/query';
import all from '@foscia/core/actions/context/runners/all';
import mergeEnhancers from '@foscia/core/actions/context/utilities/mergeEnhancers';
import when from '@foscia/core/actions/context/when';
import { Action, ConsumeModel } from '@foscia/core/actions/types';
import resolveModelAction from '@foscia/core/connections/resolveModelAction';
import isPluralRelation from '@foscia/core/model/props/checks/isPluralRelation';
import { Model, ModelInstance, ModelRelation } from '@foscia/core/model/types';
import makeStandardizedLazyLoader
  from '@foscia/core/relations/loaders/lazy/makeStandardizedLazyLoader';
import { FilteredLazyLoaderConfig } from '@foscia/core/relations/loaders/types';
import { ParsedInclude, ParsedIncludeMap } from '@foscia/core/relations/types';
import fillLoadedRelation from '@foscia/core/relations/utilities/fillLoadedRelation';
import { Multimap, multimapSet, wrap } from '@foscia/shared';

// TODO Decline to support belongsTo, etc. (see connections tests):
// TODO   Belongs to: where id in instances.foreign_id
// TODO   Has one/many: where foreign_id in instances.id
// TODO   Morphed to: where id in instances.foreign_id (model has same type than stored)
// TODO   Morphed one/many: where foreign_id in instances.id & foreign_type = instances.type

/**
 * Create a {@link StandardizedLazyLoader | `StandardizedLazyLoader`}
 * grouping and filtering queries by models to improve relations
 * loading performance for multiple relations over multiple instances loading.
 *
 * @category Factories
 * @since 0.13.0
 */
export default <Reference>(
  config: FilteredLazyLoaderConfig<Reference>,
) => makeStandardizedLazyLoader(async (instances: ModelInstance[], relations: ParsedIncludeMap) => {
  const references: Multimap<[ModelRelation, ModelInstance], Reference[]> = new Map();
  await Promise.all(instances.map(
    (instance) => Promise.all(Array.from(relations, async ([relation]) => multimapSet(
      references,
      [relation, instance],
      wrap(await config.extract(instance, relation)),
    ))),
  ));

  const models: Multimap<[Model, ModelRelation], ParsedInclude> = new Map();
  await Promise.all(Array.from(
    relations,
    async ([relation, parsedInclude]) => parsedInclude.models.forEach(
      (model) => multimapSet(models, [model, relation], parsedInclude),
    ),
  ));

  const relatedMap: Map<Reference, ModelInstance[]> = new Map();
  await Promise.all(Array.from(models, async ([model, includes]) => {
    // TODO Option to merge model actions.
    const modelActions = new Map<ModelRelation | null, [Action<any>, Reference[]]>();
    includes.forEach((parsedInclude, relation) => {
      const currentReferences = [...(references.get(relation)?.values() ?? [])].flat();
      let currentAction: [Action<ConsumeModel>, Reference[]];
      const action = resolveModelAction(model)(query(model, { query: null, include: null }));
      const customQuery = mergeEnhancers(parsedInclude.relationQuery, parsedInclude.customQuery);
      if (customQuery) {
        currentAction = [action(customQuery), currentReferences];
      } else {
        const [prevAction, prevReferences] = modelActions.get(null) ?? [];
        currentAction = [
          prevAction ?? action,
          [...(prevReferences ?? []), ...currentReferences],
        ];
      }

      currentAction[0](when(() => parsedInclude.include, include(parsedInclude.include!)));

      modelActions.set(relation, currentAction);
    });

    await Promise.all(Array.from(modelActions, async ([relation, [action, refs]]) => {
      if (refs.length && await config.prepare(action, refs, relation) !== false) {
        (await config.remap(refs, await action(all()), relation)).forEach(
          (instance, reference) => relatedMap.set(reference, instance),
        );
      }
    }));
  }));

  references.forEach(
    (referencesByInstance, relation) => referencesByInstance.forEach(
      (refs, instance) => {
        const related = refs.reduce((r, ref) => [
          ...r, ...(relatedMap.get(ref) ?? []),
        ], [] as ModelInstance[]);

        fillLoadedRelation(
          instance,
          relation.key,
          isPluralRelation(relation) ? related : (related[0] ?? null),
        );
      },
    ),
  );
});
