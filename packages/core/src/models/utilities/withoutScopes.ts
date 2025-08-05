import {
  Model,
  ModelInstance,
  ModelRelationKey,
  ModelRelationProp,
} from '@foscia/core/models/types';
import { temporaryBackup } from '@foscia/shared';

function withoutScopes<T>(model: Model, callback: () => T): T;
function withoutScopes<I extends ModelInstance, T>(
  model: Model<I>,
  relation: ModelRelationKey<I>,
  callback: () => T,
): T;

function withoutScopes<I extends ModelInstance, T>(
  model: Model<I>,
  relation: ModelRelationKey<I> | (() => T),
  callback?: () => T,
) {
  const [scopedObject, realCallback] = typeof relation === 'function'
    ? [model.$config, relation]
    // TODO Validate relation.
    : [model.$schema.get(relation) as ModelRelationProp, callback!];

  return temporaryBackup(realCallback, () => {
    const scopesBackup = model.$config.scopes;
    scopedObject.scopes = undefined;
    return scopesBackup;
  }, (scopesBackup) => {
    scopedObject.scopes = scopesBackup;
  });
}

export default withoutScopes;
