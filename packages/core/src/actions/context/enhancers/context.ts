import makeEnhancersExtension from '@foscia/core/actions/extensions/makeEnhancersExtension';
import { Action, ActionParsedExtension } from '@foscia/core/actions/types';

/**
 * Merge the given context into the action's current context.
 * The context is not deeply merged.
 *
 * @param contextToMerge
 *
 * @category Enhancers
 */
export default function context<NC extends {}>(contextToMerge: NC) {
  return async <C extends {}>(action: Action<C>) => action.updateContext({
    ...await action.useContext(),
    ...contextToMerge,
  });
}

type EnhancerExtension = ActionParsedExtension<{
  context<C extends {}, E extends {}, NC extends {}>(
    this: Action<C, E>,
    context: NC,
  ): Action<C & NC, E>;
}>;

context.extension = makeEnhancersExtension({ context }) as EnhancerExtension;
