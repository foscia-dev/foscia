import makeEnhancer from '@foscia/core/actions/utilities/makeEnhancer';
import { Action } from '@foscia/core/actions/types';

/**
 * Merge the given context into the action's current context.
 * The context is not deeply merged.
 *
 * @param contextToMerge
 *
 * @category Enhancers
 *
 * @example
 * ```typescript
 * import { context } from '@foscia/core';
 *
 * action(context({ /* ...additional context... *\/ }));
 * ```
 *
 * @remarks
 * This is the most basic context enhancer.
 * It is used by a lot of Foscia enhancers.
 */
export default /* @__PURE__ */ makeEnhancer('context', <Context extends {}, NewContext extends {}>(
  contextToMerge: NewContext,
) => async (action: Action<Context>) => action.updateContext({
  ...await action.useContext(),
  ...contextToMerge,
}));
