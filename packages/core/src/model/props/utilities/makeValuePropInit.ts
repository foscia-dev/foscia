import FosciaError from '@foscia/core/errors/fosciaError';
import runHooksSync from '@foscia/core/hooks/runHooksSync';
import logger from '@foscia/core/logger/logger';
import { ModelValueProp } from '@foscia/core/model/types';
import forceFill from '@foscia/core/model/utilities/forceFill';
import { value } from '@foscia/shared';

export default (): Pick<ModelValueProp, 'init'> & ThisType<ModelValueProp> => ({
  init(instance) {
    Object.defineProperty(instance, this.key, {
      enumerable: true,
      get: () => {
        const readingHookEvent = { instance, prop: this, value: instance.$values[this.key] };

        runHooksSync(instance.$model, `property:reading:${this.key}`, readingHookEvent);
        runHooksSync(instance.$model, 'property:reading', readingHookEvent);

        const current = instance.$values[this.key];
        if (current === undefined && (
          instance.$model.$config.strictProperties ?? instance.$model.$config.strict ?? false
        )) {
          throw new FosciaError(
            `\`${instance.$model.$type}.${this.key}\` value was not retrieved from the data source and model uses strict properties.`,
          );
        }

        const readHookEvent = { instance, prop: this, value: current };
        runHooksSync(instance.$model, `property:read:${this.key}`, readHookEvent);
        runHooksSync(instance.$model, 'property:read', readHookEvent);

        return current;
      },
      set: (next: unknown) => {
        const writeHookEvent = { instance, prop: this, prev: instance.$values[this.key], next };

        runHooksSync(instance.$model, `property:writing:${this.key}`, writeHookEvent);
        runHooksSync(instance.$model, 'property:writing', writeHookEvent);

        if (this.readOnly && (
          instance.$model.$config.strictReadOnly ?? instance.$model.$config.strict ?? true
        )) {
          throw new FosciaError(
            `\`${instance.$model.$type}.${this.key}\` cannot be set because it is read-only.`,
          );
        }

        // eslint-disable-next-line no-param-reassign
        instance.$values[this.key] = next;

        runHooksSync(instance.$model, `property:write:${this.key}`, writeHookEvent);
        runHooksSync(instance.$model, 'property:write', writeHookEvent);
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
