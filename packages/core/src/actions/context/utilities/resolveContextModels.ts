import isAction from '@foscia/core/actions/checks/isAction';
import { Action, ConsumeModel, ConsumeModelAs, ConsumeModelRelation } from '@foscia/core/actions/types';
import resolveRelatedModels from '@foscia/core/relations/utilities/resolveRelatedModels';
import { Nullable } from '@foscia/shared';

/**
 * Context used to guess models.
 *
 * @internal
 */
export type ResolveModelContext =
  Nullable<Partial<ConsumeModelAs & ConsumeModel & ConsumeModelRelation>>;

/**
 * Resolve models targeted by an action or a context.
 *
 * @param action
 *
 * @category Utilities
 */
export default async (action: Action<ResolveModelContext> | ResolveModelContext) => {
  const context = isAction(action) ? await action.useContext() : action;
  if (context.queryAs) {
    return context.queryAs;
  }

  if (context.relation) {
    return resolveRelatedModels(context.relation);
  }

  return context.model ? [context.model] : [];
};
