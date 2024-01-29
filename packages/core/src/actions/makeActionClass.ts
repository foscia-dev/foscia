import {
  Action,
  ActionClass,
  ActionHooksDefinition,
  ContextEnhancer,
  ContextRunner,
} from '@foscia/core/actions/types';
import registerHook from '@foscia/core/hooks/registerHook';
import runHooks from '@foscia/core/hooks/runHooks';
import { HooksRegistrar } from '@foscia/core/hooks/types';
import withoutHooks from '@foscia/core/hooks/withoutHooks';
import logger from '@foscia/core/logger/logger';
import { Dictionary, eachDescriptors, sequentialTransform } from '@foscia/shared';

export default function makeActionClass<Extension extends {} = {}>(
  extensions?: Extension & ThisType<Action<{}, Extension>>,
) {
  class CustomActionClass {
    public $hooks: HooksRegistrar<ActionHooksDefinition> | null;

    private $enhancementsQueue: ContextEnhancer<any, any, any>[];

    private $context: Dictionary;

    public static extend(newExtensions?: Dictionary) {
      eachDescriptors(newExtensions ?? {}, (key, descriptor) => {
        Object.defineProperty(this.prototype, key, descriptor);
      });

      return this;
    }

    public constructor() {
      this.$enhancementsQueue = [];
      this.$context = {};
      this.$hooks = {};

      registerHook(this, 'running', (event) => logger.debug('Action running.', [event]));
      registerHook(this, 'success', (event) => logger.debug('Action success.', [event]));
      registerHook(this, 'error', (event) => logger.debug('Action error.', [event]));
    }

    public async useContext() {
      await this.dequeueEnhancements();

      return this.$context;
    }

    public updateContext(newContext: Dictionary) {
      this.$context = newContext;

      return this;
    }

    public use(...enhancers: ContextEnhancer<any, any, any>[]) {
      this.$enhancementsQueue.push(...enhancers);

      return this;
    }

    public async run(runner: ContextRunner<any, any, any>) {
      const context = await this.useContext();

      await runHooks(this, 'running', { context, runner });

      try {
        // Context runner might use other context runners, so we must disable
        // hooks at this point to avoid duplicated hooks runs.
        const result = await withoutHooks(this, async () => runner(this as any));

        await runHooks(this, 'success', { context, result });

        return result;
      } catch (error) {
        await runHooks(this, 'error', { context, error });

        throw error;
      } finally {
        await runHooks(this, 'finally', { context });
      }
    }

    private async dequeueEnhancements() {
      const enhancements = this.$enhancementsQueue.map((e) => async () => {
        await e(this as any);

        // Any enhancement might push other enhancement in the queue,
        // so we must process those too.
        await this.dequeueEnhancements();
      });

      this.$enhancementsQueue = [];

      await sequentialTransform(enhancements);
    }
  }

  return CustomActionClass.extend(extensions) as ActionClass<{}, Extension>;
}
