import guessRelationType from '@foscia/core/model/relations/guessRelationType';
import { Model, ModelRelation } from '@foscia/core/model/types';
import { RegistryI } from '@foscia/core/types';
import { isNil, Optional, wrap } from '@foscia/shared';

function guessModelIn(
  model: Optional<Model | Model[]>,
  ensureType?: Optional<string>,
) {
  const models = wrap(model);
  if (isNil(ensureType)) {
    if (models.length > 1) {
      return null;
    }

    return models[0] ?? null;
  }

  return models.find((m) => m.$type === ensureType) ?? null;
}

export default async function guessContextModel(
  context: {
    model?: Optional<Model>;
    relation?: Optional<ModelRelation>;
    registry?: Optional<RegistryI>;
    ensureType?: Optional<string>;
  },
) {
  if (context.relation) {
    if (context.relation.model) {
      return guessModelIn(await context.relation.model(), context.ensureType);
    }

    const { registry } = context;
    const possibleTypes = wrap(
      context.relation.type
      ?? (context.model?.$config.guessRelationType ?? guessRelationType)(context.relation),
    );
    if (registry && possibleTypes.length) {
      const possibleModels = await Promise.all(
        possibleTypes.map((type) => registry.modelFor(type)),
      );

      return guessModelIn(possibleModels.filter((m) => !!m) as Model[], context.ensureType);
    }

    return null;
  }

  return guessModelIn(context.model, context.ensureType);
}
