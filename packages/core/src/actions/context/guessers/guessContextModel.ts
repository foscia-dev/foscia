import guessRelationType from '@foscia/core/model/relations/guessRelationType';
import { Model, ModelRelation } from '@foscia/core/model/types';
import { RegistryI } from '@foscia/core/types';
import { isNil, Optional } from '@foscia/shared';

type GuessedContextModel<LoadModel extends boolean> = LoadModel extends true
  ? Model | undefined
  : string | undefined;

export default async function guessContextModel<LoadModel extends boolean>(
  context: {
    model?: Optional<Model>;
    relation?: Optional<ModelRelation>;
    registry?: Optional<RegistryI>;
  },
  loadModel: LoadModel,
): Promise<GuessedContextModel<LoadModel>> {
  if (context.relation) {
    if (context.relation.model) {
      return (
        loadModel ? context.relation.model() : (await context.relation.model()).$type
      ) as GuessedContextModel<LoadModel>;
    }

    const type = context.relation.type
      ?? (context.model?.$config.guessRelationType ?? guessRelationType)(context.relation);
    if (context.registry && !isNil(type)) {
      return (
        loadModel ? (await context.registry.modelFor(type)) : type
      ) as GuessedContextModel<LoadModel>;
    }

    return undefined;
  }

  return (
    loadModel ? (context.model ?? undefined) : context.model?.$type
  ) as GuessedContextModel<LoadModel>;
}
