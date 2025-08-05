import FosciaError from '@foscia/core/errors/fosciaError';
import runSyncHooks from '@foscia/core/hooks/runSyncHooks';
import { HooksRegistrar } from '@foscia/core/hooks/types';
import applyDefinition from '@foscia/core/models/old/composition/utilities/applyDefinition';
import {
  Model,
  ModelConfig,
  ModelHooksDefinition,
  ModelInstance,
  ModelSnapshot,
} from '@foscia/core/models/oldTypes';
import {
  SYMBOL_MODEL_CLASS,
  SYMBOL_MODEL_INSTANCE,
  SYMBOL_MODEL_SNAPSHOT,
} from '@foscia/core/symbols';

/**
 * Create a model class.
 *
 * @param connection
 * @param type
 * @param config
 * @param hooks
 * @param definition
 *
 * @internal
 */
export default (
  connection: string,
  type: string,
  config: ModelConfig,
  hooks: HooksRegistrar<ModelHooksDefinition>,
  definition: object,
) => {
  if (type.length === 0) {
    throw new FosciaError('Model type cannot be an empty string.');
  }

  const { defineProperty } = Object;

  const parseModel = (currentModel: Model) => {
    if (!currentModel.$parsed) {
      defineProperty(currentModel, '$composables', { value: [] });
      defineProperty(currentModel, '$schema', { value: {} });
      defineProperty(currentModel, '$hooks', { writable: true, value: {} });

      // eslint-disable-next-line no-param-reassign
      applyDefinition(currentModel, definition);

      // eslint-disable-next-line no-param-reassign
      currentModel.$parsed = true;
    }
  };

  const model = function ModelConstructor(this: ModelInstance) {
    defineProperty(this, '$FOSCIA_TYPE', { value: SYMBOL_MODEL_INSTANCE });
    defineProperty(this, '$model', { value: this.constructor });
    defineProperty(this, '$exists', { writable: true, value: false });
    defineProperty(this, '$raw', { writable: true, value: null });
    defineProperty(this, '$loaded', { writable: true, value: {} });
    defineProperty(this, '$values', { writable: true, value: {} });
    defineProperty(this, '$original', {
      writable: true,
      value: {
        $FOSCIA_TYPE: SYMBOL_MODEL_SNAPSHOT,
        $original: null,
        $instance: this,
        $exists: false,
        $raw: null,
        $loaded: {},
        $values: {},
      } satisfies ModelSnapshot,
    });

    parseModel(this.$model);

    this.$model.$composables.forEach((composable) => composable.init?.(this));

    if (!this.$model.$booted) {
      runSyncHooks(this.$model, 'boot', this.$model);
      this.$model.$booted = true;
    }

    runSyncHooks(this.$model, 'init', this);
  } as unknown as Model;

  defineProperty(model, '$FOSCIA_TYPE', { value: SYMBOL_MODEL_CLASS });
  defineProperty(model, '$connection', { value: connection });
  defineProperty(model, '$type', { value: type });
  defineProperty(model, '$config', { value: { ...config } });
  defineProperty(model, '$parsed', { writable: true, value: false });
  defineProperty(model, '$booted', { writable: true, value: false });

  const defineOverwrittenProperty = (property: string) => defineProperty(model, property, {
    configurable: true,
    get() {
      parseModel(this);

      return this[property];
    },
  });

  defineOverwrittenProperty('$composables');
  defineOverwrittenProperty('$schema');
  defineOverwrittenProperty('$hooks');

  return model;
};
