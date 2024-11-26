import makeContextFunctionFactory from '@foscia/core/actions/makeContextFunctionFactory';
import { Action, ContextEnhancer, ContextRunner } from '@foscia/core/actions/types';
import { SYMBOL_ACTION_CONTEXT_WHEN } from '@foscia/core/symbols';
import { Awaitable, OnlyFalsy, OnlyTruthy, Value, value } from '@foscia/shared';

export default /* @__PURE__ */ makeContextFunctionFactory(
  SYMBOL_ACTION_CONTEXT_WHEN,
  'when',
  (<C extends {}, V, TR, FR = void>(
    expression: V,
    truthyCallback: (action: Action<C>, value: OnlyTruthy<Awaited<Value<V>>>) => TR,
    falsyCallback?: (action: Action<C>, value: OnlyFalsy<Awaited<Value<V>>>) => FR,
  ) => async (action: Action<C>) => {
    const exprValue = await value(expression as Function);

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

    return undefined as any;
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
     * action().use(when(foo, filterBy('foo', foo)));
     * ```
     */<C extends {}, V, TC extends {} = C>(
      expression: V,
      truthyCallback: (
        action: Action<C>,
        value: OnlyTruthy<Awaited<Value<V>>>,
      ) => Awaitable<Action<TC> | void>,
    ): ContextEnhancer<C, TC>;
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
     * action().use(when(foo, filterBy('foo', foo), filterBy('bar', 'bar')));
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
    ): ContextEnhancer<C, TC | FC>;
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
     * action().run(when(changed(post), oneOrFail()));
     * ```
     */<C extends {}, V, TR>(
      expression: V,
      truthyCallback: (action: Action<C>, value: OnlyTruthy<Awaited<Value<V>>>) => TR,
    ): ContextRunner<C, TR | void>;
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
     * action().run(when(changed(post), oneOrFail(), () => post));
     * ```
     */<C extends {}, V, TR, FR>(
      expression: V,
      truthyCallback: (action: Action<C>, value: OnlyTruthy<Awaited<Value<V>>>) => TR,
      falsyCallback: (action: Action<C>, value: OnlyFalsy<Awaited<Value<V>>>) => FR,
    ): ContextRunner<C, TR | FR>;
  },
);
