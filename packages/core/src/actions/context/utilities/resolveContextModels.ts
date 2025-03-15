import isAction from '@foscia/core/actions/checks/isAction';
import {
  Action,
  ConsumeModel,
  ConsumeQueryAs,
  ConsumeRegistry,
  ConsumeRelation,
} from '@foscia/core/actions/types';
import resolveRelatedModels from '@foscia/core/relations/utilities/resolveRelatedModels';
import { Nullable } from '@foscia/shared';

/**
 * Context used to guess models.
 *
 * @internal
 */
export type ResolveModelContext =
  Nullable<Partial<ConsumeQueryAs & ConsumeModel & ConsumeRelation & ConsumeRegistry>>;

/**
 * Resolve models targeted by an action or a context.
 *
 * @param action
 *
 * @category Utilities
 * @internal
 */
export default async (action: Action<ResolveModelContext> | ResolveModelContext) => {
  const context = isAction(action) ? await action.useContext() : action;
  if (context.queryAs) {
    return context.queryAs;
  }

  if (context.relation) {
    return resolveRelatedModels(context.relation, context.registry);
  }

  return context.model ? [context.model] : [];
};
