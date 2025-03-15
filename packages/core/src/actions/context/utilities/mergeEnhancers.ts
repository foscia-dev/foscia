import { Action, AnonymousEnhancer } from '@foscia/core/actions/types';

type MergedEnhancers<
  E1 extends AnonymousEnhancer<C1, NC1> | null | undefined,
  E2 extends AnonymousEnhancer<C2, NC2> | null | undefined,
  C1 extends {} = {},
  NC1 extends {} = C1,
  C2 extends {} = {},
  NC2 extends {} = C2,
> = E1 extends null | undefined
  ? E2 extends null | undefined ? null : E2
  : AnonymousEnhancer<C1 & C2, NC1 & NC2>;

/**
 * Merge to optional enhancers.
 *
 * @param enhancer1
 * @param enhancer2
 *
 * @internal
 */
export default <
  C1 extends {} = {},
  NC1 extends {} = C1,
  C2 extends {} = {},
  NC2 extends {} = C2,
>(
  enhancer1: AnonymousEnhancer<C1, NC1> | null | undefined,
  enhancer2: AnonymousEnhancer<C2, NC2> | null | undefined,
) => (
  enhancer1 && enhancer2
    ? ((
      action: Action<C1 & C2>,
    ) => {
      if (enhancer1) {
        action(enhancer1);
      }

      if (enhancer2) {
        action(enhancer2);
      }
    })
    : (enhancer2 ?? enhancer1 ?? null)
) as MergedEnhancers<typeof enhancer1, typeof enhancer2, C1, NC1, C2, NC2>;
