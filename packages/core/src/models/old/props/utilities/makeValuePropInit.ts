import FosciaError from '@foscia/core/errors/fosciaError';
import runSyncHooks from '@foscia/core/hooks/runSyncHooks';
import logger from '@foscia/core/logger/logger';
import {
  ModelInstancePropertyReadHookCallback,
  ModelInstancePropertyWriteHookCallback,
  ModelValueProp,
} from '@foscia/core/models/oldTypes';
import forceFill from '@foscia/core/models/utilities/forceFill';
import { value } from '@foscia/shared';

export type ValuePropOptions<P extends ModelValueProp> = {
  onRead?: ModelInstancePropertyReadHookCallback<P>;
  onWrite?: ModelInstancePropertyWriteHookCallback<P>;
};

export default <P extends ModelValueProp>(
  options?: ValuePropOptions<P>,
): Pick<P, 'init'> & ThisType<P> => ({
  init(instance) {
    Object.defineProperty(instance, this.key, {
      enumerable: true,
      get: () => {
        const readingHookEvent = { instance, prop: this, value: instance.$values[this.key] };

        runSyncHooks(instance.$model, `property:reading:${this.key}`, readingHookEvent);
        runSyncHooks(instance.$model, 'property:reading', readingHookEvent);

        const current = instance.$values[this.key];
        if (current === undefined && (
          instance.$model.$config.strictProperties ?? instance.$model.$config.strict ?? false
        )) {
          throw new FosciaError(
            `\`${instance.$model.$type}.${this.key}\` value was not retrieved from the data source and model uses strict properties.`,
          );
        }

        const readHookEvent = { instance, prop: this, value: current };
        runSyncHooks(instance.$model, `property:read:${this.key}`, readHookEvent);
        runSyncHooks(instance.$model, 'property:read', readHookEvent);

        options?.onRead?.(readHookEvent);

        return current;
      },
      set: (next: any) => {
        const writeHookEvent = { instance, prop: this, prev: instance.$values[this.key], next };

        runSyncHooks(instance.$model, `property:writing:${this.key}`, writeHookEvent);
        runSyncHooks(instance.$model, 'property:writing', writeHookEvent);

        if (this.readOnly && (
          instance.$model.$config.strictReadOnly ?? instance.$model.$config.strict ?? true
        )) {
          throw new FosciaError(
            `\`${instance.$model.$type}.${this.key}\` cannot be set because it is read-only.`,
          );
        }

        // eslint-disable-next-line no-param-reassign
        instance.$values[this.key] = next;

        runSyncHooks(instance.$model, `property:write:${this.key}`, writeHookEvent);
        runSyncHooks(instance.$model, 'property:write', writeHookEvent);

        options?.onWrite?.(writeHookEvent);
      },
    });

    if (this.default !== undefined) {
      if (this.default && typeof this.default === 'object') {
        logger.warn(
          `Default \`${instance.$model.$type}.${this.key}\` object attribute's value must be defined using a factory function.`,
        );
      }

      forceFill(instance, { [this.key]: value(this.default) });
    }
  },
});
