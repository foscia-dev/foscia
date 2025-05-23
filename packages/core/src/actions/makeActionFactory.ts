import isRunner from '@foscia/core/actions/checks/isRunner';
import isWhen from '@foscia/core/actions/checks/isWhen';
import {
  Action,
  ActionCall,
  ActionFactory,
  AnonymousEnhancer,
  AnonymousRunner,
} from '@foscia/core/actions/types';
import { configuration } from '@foscia/core/configuration';
import FosciaError from '@foscia/core/errors/fosciaError';
import registerHook from '@foscia/core/hooks/registerHook';
import runHooks from '@foscia/core/hooks/runHooks';
import withoutHooks from '@foscia/core/hooks/withoutHooks';
import logger from '@foscia/core/logger/logger';
import { SYMBOL_ACTION } from '@foscia/core/symbols';
import {
  Dictionary,
  Middleware,
  sequentialTransform,
  throughMiddlewares,
  uniqueId,
  unsafeId,
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
) => {
  const connectionId = uniqueId(
    unsafeId,
    Object.values(configuration.connections ?? {}).map((a) => a?.connectionId ?? ''),
  );

  const factory: ActionFactory<Context> = (
    ...immediateEnhancers: (AnonymousEnhancer<any, any> | AnonymousRunner<any, any>)[]
  ) => {
    const currentCalls: ActionCall[] = [];
    let currentCall: ActionCall | null = null;

    let currentQueue: AnonymousEnhancer<any, any>[] = [];
    let currentContext: Dictionary = {
      actionConnectionId: connectionId,
      ...value(initialContext),
    };

    const isRun = (enhancer: unknown): boolean => {
      if (isWhen(enhancer)) {
        return isRun(enhancer.meta.args[1]) || isRun(enhancer.meta.args[2]);
      }

      return isRunner(enhancer);
    };

    const dequeueEnhancers = async (action: Action<Context>) => {
      const enhancements = currentQueue.map((enhancer) => async () => {
        await action.track(enhancer);
      });

      currentQueue = [];

      await sequentialTransform(enhancements);
    };

    let action: Action<any>;

    const invokableAction = (...args: AnonymousEnhancer<any, any>[]) => (
      args.length && isRun(args[args.length - 1])
        ? (action.run as any)(...args)
        : (action.use as any)(...args)
    );

    action = Object.assign(invokableAction, {
      $FOSCIA_TYPE: SYMBOL_ACTION,
      $hooks: {},
      async useContext() {
        await dequeueEnhancers(this);

        return currentContext;
      },
      updateContext(newContext: Dictionary) {
        currentContext = newContext;

        return this;
      },
      use(...enhancers: AnonymousEnhancer<any, any>[]) {
        currentQueue.push(...enhancers);

        return this;
      },
      async run(...enhancers: (AnonymousEnhancer<any, any> | AnonymousRunner<any, any>)[]) {
        if (enhancers.length === 0) {
          throw new FosciaError('`run` must be called with at least one runner function.');
        }

        const runner = enhancers.pop() as AnonymousRunner<any, any>;

        (this.use as any)(...enhancers);

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
        call?: AnonymousEnhancer<any, any> | AnonymousRunner<any, any>,
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
    } as Action<any>);

    registerHook(action, 'running', (event) => logger.debug('Action running.', event));
    registerHook(action, 'success', (event) => logger.debug('Action success.', event));
    registerHook(action, 'error', (event) => logger.debug('Action error.', event));

    return (action as any)(...immediateEnhancers);
  };

  factory.connectionId = connectionId;

  if (!configuration.connections || !configuration.connections.default) {
    configuration.connections = {
      ...configuration.connections,
      default: factory,
    };
  }

  return factory;
};
