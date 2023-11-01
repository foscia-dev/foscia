import consumeModel from '@foscia/core/actions/context/consumers/consumeModel';
import consumeRegistry from '@foscia/core/actions/context/consumers/consumeRegistry';
import consumeRelation from '@foscia/core/actions/context/consumers/consumeRelation';
import { ConsumeModel, ConsumeRegistry, ConsumeRelation } from '@foscia/core/actions/types';
import { Model } from '@foscia/core/model/types';
import guessRelationType from '@foscia/core/model/relations/guessRelationType';
import { isNil } from '@foscia/shared';

type GuessedContextModel<LoadModel extends boolean> = LoadModel extends true
  ? Model | undefined
  : string | undefined;

export default async function guessContextModel<LoadModel extends boolean>(
  context: Partial<ConsumeModel & ConsumeRelation & ConsumeRegistry>,
  loadModel: LoadModel,
): Promise<GuessedContextModel<LoadModel>> {
  const registry = consumeRegistry(context, null);

  const model = consumeModel(context, null);
  const relation = consumeRelation(context, null);
  if (relation) {
    if (relation.model) {
      return (
        loadModel ? relation.model() : (await relation.model()).$type
      ) as GuessedContextModel<LoadModel>;
    }

    const type = relation.type
      ?? (model?.$config?.guessRelationType ?? guessRelationType)(relation);
    if (registry && !isNil(type)) {
      return (
        loadModel ? (await registry.modelFor(type)) : type
      ) as GuessedContextModel<LoadModel>;
    }

    return undefined;
  }

  return (
    loadModel ? (model ?? undefined) : model?.$type
  ) as GuessedContextModel<LoadModel>;
}
