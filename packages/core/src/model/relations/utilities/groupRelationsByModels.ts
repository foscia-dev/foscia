import { consumeRegistry, guessContextModel } from '@foscia/core/actions';
import FosciaError from '@foscia/core/errors/fosciaError';
import { Model, ModelRelationKey } from '@foscia/core/model/types';

export default async <M extends Model>(
  model: M,
  relations: Map<ModelRelationKey<M>, string[]>,
  context: {},
) => {
  const modelsPerRelations = await Promise.all(
    [...relations.entries()].map(async ([relation, nested]) => {
      const def = model.$schema[relation];
      const related = await guessContextModel({
        model,
        relation: def,
        registry: await consumeRegistry(context, null),
      }, true);
      if (!related.length) {
        throw new FosciaError(`
No alternative found to resolve model for relation \`${model.$type}.${relation}\`.
You should either:
  - Define explicit related model/type on your relations.
  - Define a registry to hold types to models mapping.
`.trim());
      }

      return [related, relation, nested] as [Model[], ModelRelationKey<M>, string[]];
    }),
  );

  const groups = new Map<Model, { relations: ModelRelationKey<M>[]; nested: string[] }>();
  modelsPerRelations.forEach(([related, relation, nested]) => {
    related.forEach((r) => {
      const prev = groups.get(r) ?? { relations: [], nested: [] };
      groups.set(r, {
        relations: [...prev.relations, relation],
        nested: [...prev.nested, ...nested],
      });
    });
  });

  return groups;
};
