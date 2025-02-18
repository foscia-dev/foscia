import { Action, AnonymousEnhancer, AnonymousRunner } from '@foscia/core/actions/types';
import makeContextFunctionFactory from '@foscia/core/actions/utilities/makeContextFunctionFactory';
import { SYMBOL_ACTION_WHEN } from '@foscia/core/symbols';
import { Awaitable, OnlyFalsy, OnlyTruthy, Value, value } from '@foscia/shared';

export default /* @__PURE__ */ makeContextFunctionFactory(SYMBOL_ACTION_WHEN)(
  'when',
  (<C extends {}, V, TR, FR = void>(
    expression: V,
    truthyCallback: (action: Action<C>, value: OnlyTruthy<Awaited<Value<V>>>) => TR,
    falsyCallback?: (action: Action<C>, value: OnlyFalsy<Awaited<Value<V>>>) => FR,
    // eslint-disable-next-line consistent-return
  ) => async (action: Action<C>) => {
    const exprValue = await value(expression);

    if (exprValue) {
      return action.track(
        (a) => truthyCallback(a, exprValue as OnlyTruthy<Awaited<Value<V>>>),
        truthyCallback as any,
      );
    }

    if (falsyCallback !== undefined) {
      return action.track(
        (a) => falsyCallback(a, exprValue as OnlyFalsy<Awaited<Value<V>>>),
        falsyCallback as any,
      );
    }
  }) as {
    /**
     * Create an enhancer that runs if `expression` is truthy.
     * [Get more details on actions conditionals](/docs/core-concepts/actions#conditionals).
     *
     * @param expression
     * @param truthyCallback
     *
     * @category Enhancers
     *
     * @example
     * ```typescript
     * import { when } from '@foscia/core';
     * import { filterBy } from '@foscia/jsonapi';
     *
     * action(when(foo, filterBy('foo', foo)));
     * ```
     */<C extends {}, V, TC extends {} = C>(
      expression: V,
      truthyCallback: (
        action: Action<C>,
        value: OnlyTruthy<Awaited<Value<V>>>,
      ) => Awaitable<Action<TC> | void>,
    ): AnonymousEnhancer<C, TC>;
    /**
     * Create two enhancers that run depending on `expression` truthiness.
     * [Get more details on actions conditionals](/docs/core-concepts/actions#conditionals).
     *
     * @param expression
     * @param truthyCallback
     * @param falsyCallback
     *
     * @category Enhancers
     *
     * @example
     * ```typescript
     * import { when } from '@foscia/core';
     * import { filterBy } from '@foscia/jsonapi';
     *
     * action(when(foo, filterBy('foo', foo), filterBy('bar', 'bar')));
     * ```
     */<C extends {}, V, TC extends {} = C, FC extends {} = C>(
      expression: V,
      truthyCallback: (
        action: Action<C>,
        value: OnlyTruthy<Awaited<Value<V>>>,
      ) => Awaitable<Action<TC> | void>,
      falsyCallback: (
        action: Action<C>,
        value: OnlyFalsy<Awaited<Value<V>>>,
      ) => Awaitable<Action<FC> | void>,
    ): AnonymousEnhancer<C, TC | FC>;
    /**
     * Create a runner that runs if `expression` is truthy.
     * [Get more details on actions conditionals](/docs/core-concepts/actions#conditionals).
     *
     * @param expression
     * @param truthyCallback
     *
     * @category Runners
     *
     * @example
     * ```typescript
     * import { when, changed, oneOrFail } from '@foscia/core';
     *
     * action(when(changed(post), oneOrFail()));
     * ```
     */<C extends {}, V, TR>(
      expression: V,
      truthyCallback: (action: Action<C>, value: OnlyTruthy<Awaited<Value<V>>>) => TR,
    ): AnonymousRunner<C, TR | void>;
    /**
     * Create two runners that run depending on `expression` truthiness.
     * [Get more details on actions conditionals](/docs/core-concepts/actions#conditionals).
     *
     * @param expression
     * @param truthyCallback
     * @param falsyCallback
     *
     * @category Runners
     *
     * @example
     * ```typescript
     * import { when, changed, oneOrFail } from '@foscia/core';
     *
     * action(when(changed(post), oneOrFail(), () => post));
     * ```
     */<C extends {}, V, TR, FR>(
      expression: V,
      truthyCallback: (action: Action<C>, value: OnlyTruthy<Awaited<Value<V>>>) => TR,
      falsyCallback: (action: Action<C>, value: OnlyFalsy<Awaited<Value<V>>>) => FR,
    ): AnonymousRunner<C, TR | FR>;
  },
);
