import appendExtension from '@foscia/core/actions/extensions/appendExtension';
import { Action, WithParsedExtension } from '@foscia/core/actions/types';

/**
 * Merge the given context into the action's current context.
 * The context is not deeply merged.
 *
 * @param contextToMerge
 *
 * @category Enhancers
 */
function context<NC extends {}>(contextToMerge: NC) {
  return async <C extends {}>(action: Action<C>) => action.updateContext({
    ...await action.useContext(),
    ...contextToMerge,
  });
}

export default /* @__PURE__ */ appendExtension(
  'context',
  context,
  'use',
) as WithParsedExtension<typeof context, {
  context<C extends {}, E extends {}, NC extends {}>(
    this: Action<C, E>,
    context: NC,
  ): Action<C & NC, E>;
}>;
