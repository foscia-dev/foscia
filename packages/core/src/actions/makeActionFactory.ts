import {
  Action,
  ActionCall,
  ActionFactory,
  ContextEnhancer,
  ContextRunner,
} from '@foscia/core/actions/types';
import FosciaError from '@foscia/core/errors/fosciaError';
import registerHook from '@foscia/core/hooks/registerHook';
import runHooks from '@foscia/core/hooks/runHooks';
import withoutHooks from '@foscia/core/hooks/withoutHooks';
import logger from '@foscia/core/logger/logger';
import {
  Dictionary,
  Middleware,
  sequentialTransform,
  throughMiddlewares,
  value,
} from '@foscia/shared';

/**
 * Create an action factory.
 *
 * @param initialContext
 *
 * @category Factories
 */
export default <Context extends {} = {}>(
  initialContext?: Context | (() => Context),
): ActionFactory<Context> => (
  ...immediateEnhancers: (ContextEnhancer<any, any> | ContextRunner<any, any>)[]
) => {
  const currentCalls: ActionCall[] = [];
  let currentCall: ActionCall | null = null;

  let currentQueue: ContextEnhancer<any, any>[] = [];
  let currentContext: Dictionary = value(initialContext) ?? {};

  const dequeueEnhancers = async (action: Action<Context>) => {
    const enhancements = currentQueue.map((enhancer) => async () => {
      await action.track(enhancer);
    });

    currentQueue = [];

    await sequentialTransform(enhancements);
  };

  const action = {
    $hooks: {},
    async useContext() {
      await dequeueEnhancers(this);

      return currentContext;
    },
    updateContext(newContext: Dictionary) {
      currentContext = newContext;

      return this;
    },
    use(...enhancers: ContextEnhancer<any, any>[]) {
      currentQueue.push(...enhancers);

      return this;
    },
    async run(...enhancers: (ContextEnhancer<any, any> | ContextRunner<any, any>)[]) {
      if (enhancers.length === 0) {
        throw new FosciaError('`run` must be called with at least one runner function.');
      }

      const runner = enhancers.pop() as ContextRunner<any, any>;

      this.use(...enhancers);

      const { middlewares, ...context } = await this.useContext() as Dictionary;
      this.updateContext(context);

      await runHooks(this, 'running', { action: this, runner });

      try {
        // Context runner might use other context enhancers and runners,
        // so we must disable hooks at this point to avoid duplicated hooks runs.
        const result = await throughMiddlewares(
          (middlewares ?? []) as Middleware<Action, unknown>[],
          async (a) => withoutHooks(a, async () => a.track(runner)),
        )(this);

        if (result === this) {
          logger.warn('Action run result is the action itself, did you forget to pass a runner when calling `run`?');
        }

        await runHooks(this, 'success', { action: this, result });

        return result;
      } catch (error) {
        await runHooks(this, 'error', { action: this, error });

        throw error;
      } finally {
        await runHooks(this, 'finally', { action: this });
      }
    },
    async track(
      callback: (action: Action<any>) => unknown,
      call?: ContextEnhancer<any, any> | ContextRunner<any, any>,
    ) {
      const parentCall = currentCall;
      currentCall = { call: call ?? callback, calls: [] };
      (parentCall ? parentCall.calls : currentCalls).push(currentCall);

      const result = await callback(this);
      await dequeueEnhancers(this);

      currentCall = parentCall;

      return result;
    },
    calls() {
      return currentCalls;
    },
  } as any;

  registerHook(action, 'running', (event) => logger.debug('Action running.', [event]));
  registerHook(action, 'success', (event) => logger.debug('Action success.', [event]));
  registerHook(action, 'error', (event) => logger.debug('Action error.', [event]));

  return immediateEnhancers.length
    ? action.run(...immediateEnhancers)
    : action;
};
