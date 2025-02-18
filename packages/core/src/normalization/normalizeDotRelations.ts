import guessContextModel from '@foscia/core/actions/context/guessers/guessContextModel';
import logger from '@foscia/core/logger/logger';
import isRelationDef from '@foscia/core/model/props/checks/isRelationDef';
import { Model, ModelKey, ModelRelationDotKey } from '@foscia/core/model/types';
import normalizeKey from '@foscia/core/normalization/normalizeKey';
import { ModelsRegistry } from '@foscia/core/types';
import { isNone, Optional } from '@foscia/shared';

/**
 * Normalize a set of dot relation keys.
 *
 * @param model
 * @param relations
 * @param registry
 *
 * @internal
 */
const normalizeDotRelations = <M extends Model>(
  model: M,
  relations: ModelRelationDotKey<M>[],
  registry?: Optional<ModelsRegistry>,
): Promise<string[]> => Promise.all(relations.map(async (dotKey) => {
  const [currentKey, ...subKeys] = dotKey.split('.');
  const def = model.$schema[currentKey];
  if (!def || !isRelationDef(def)) {
    logger.warn(
      `Trying to normalize non-relation \`${model.$type}.${def?.key ?? currentKey}\`. Either this is not a relation or relation is not declared.`,
    );

    return dotKey;
  }

  const normalizedKey = normalizeKey(model, def.key as ModelKey<M>);
  const subDotKey = subKeys.join('.');
  if (isNone(subDotKey)) {
    return normalizedKey;
  }

  const subModel = await guessContextModel({ model, relation: def, registry });
  if (!subModel) {
    logger.debug(
      `Could not detect model for relation \`${model.$type}.${def.key}\`. Skipping sub-keys normalization.`,
    );

    return [normalizedKey, ...subKeys].join('.');
  }

  return [
    normalizedKey,
    ...await normalizeDotRelations(subModel, [subKeys.join('.')], registry),
  ].join('.');
}));

export default normalizeDotRelations;
