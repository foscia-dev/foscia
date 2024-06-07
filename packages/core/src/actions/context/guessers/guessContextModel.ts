import guessRelationType from '@foscia/core/model/relations/utilities/guessRelationType';
import { Model, ModelRelation } from '@foscia/core/model/types';
import { RegistryI } from '@foscia/core/types';
import { isNil, Optional, wrap } from '@foscia/shared';

type GuessContextModelContext = {
  model?: Optional<Model>;
  relation?: Optional<ModelRelation>;
  registry?: Optional<RegistryI>;
  ensureType?: Optional<string>;
};

function guessModelIn(
  model: Optional<Model | Model[]>,
  ensureType: Optional<string>,
  multiple: boolean,
) {
  const models = wrap(model);
  if (multiple) {
    return models;
  }

  if (isNil(ensureType)) {
    if (models.length > 1) {
      return null;
    }

    return models[0] ?? null;
  }

  return models.find((m) => m.$type === ensureType) ?? null;
}

function guessContextModel(
  context: GuessContextModelContext,
  multiple?: false,
): Promise<Model | null>;

function guessContextModel(
  context: GuessContextModelContext,
  multiple: true,
): Promise<Model[]>;

async function guessContextModel(
  context: GuessContextModelContext,
  multiple: boolean = false,
): Promise<Model[] | Model | null> {
  if (context.relation) {
    if (context.relation.model) {
      return guessModelIn(await context.relation.model(), context.ensureType, multiple);
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

      return guessModelIn(
        possibleModels.filter((m) => !!m) as Model[],
        context.ensureType,
        multiple,
      );
    }

    return null;
  }

  return guessModelIn(context.model, context.ensureType, multiple);
}

export default guessContextModel;
