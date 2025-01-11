import FosciaError from '@foscia/core/errors/fosciaError';
import mergeHooks from '@foscia/core/hooks/mergeHooks';
import runHooksSync from '@foscia/core/hooks/runHooksSync';
import { HooksRegistrar } from '@foscia/core/hooks/types';
import isComposable from '@foscia/core/model/checks/isComposable';
import isIdDef from '@foscia/core/model/checks/isIdDef';
import isPropFactory from '@foscia/core/model/checks/isPropFactory';
import makeDefinition from '@foscia/core/model/makeDefinition';
import takeSnapshot from '@foscia/core/model/snapshots/takeSnapshot';
import {
  ExtendableModel,
  Model,
  ModelConfig,
  ModelHooksDefinition,
  ModelInstance,
  ModelPropFactory,
} from '@foscia/core/model/types';
import { SYMBOL_MODEL_CLASS, SYMBOL_MODEL_INSTANCE } from '@foscia/core/symbols';
import { eachDescriptors, mapWithKeys, mergeConfig } from '@foscia/shared';

const { defineProperty } = Object;

/**
 * Create a model class.
 *
 * @param type
 * @param config
 * @param hooks
 * @param definition
 * @param parentModel
 *
 * @internal
 */
const makeModelClass = (
  type: string,
  config: ModelConfig,
  hooks: HooksRegistrar<ModelHooksDefinition>,
  definition: object,
  parentModel?: ExtendableModel,
) => {
  if (type.length === 0) {
    throw new FosciaError('Model type cannot be an empty string.');
  }

  const model = parentModel ? class extends parentModel {
  } : function ModelConstructor(this: ModelInstance) {
    defineProperty(this, '$FOSCIA_TYPE', { value: SYMBOL_MODEL_INSTANCE });
    defineProperty(this, '$model', { value: this.constructor });
    defineProperty(this, '$exists', { writable: true, value: false });
    defineProperty(this, '$raw', { writable: true, value: null });
    defineProperty(this, '$loaded', { writable: true, value: {} });
    defineProperty(this, '$values', { writable: true, value: {} });
    defineProperty(this, '$original', { writable: true, value: takeSnapshot(this) });

    Object.values(this.$model.$schema).forEach((def) => def.bind?.(this));

    if (!this.$model.$booted) {
      this.$model.$booted = true;
      runHooksSync(this.$model, 'boot', this.$model as Model);
    }

    runHooksSync(this.$model, 'init', this);
  } as unknown as ExtendableModel;

  const propFactories = new Map<string, ModelPropFactory>();

  defineProperty(model, '$FOSCIA_TYPE', { value: SYMBOL_MODEL_CLASS });
  defineProperty(model, '$type', { value: type });
  defineProperty(model, '$config', { value: { ...config } });
  defineProperty(model, '$composables', { value: [] });
  defineProperty(model, '$hooks', { writable: true, value: {} });
  defineProperty(model, '$booted', { writable: true, value: false });

  defineProperty(model, '$schema', {
    configurable: true,
    get() {
      const $schema = mapWithKeys([...propFactories.entries()], ([key, factory]) => {
        if (key === 'type') {
          throw new FosciaError(
            '`type` is forbidden as a definition key because it may be used with some implementations.',
          );
        }

        const def = factory.make(this, key);

        if ((key === 'id' || key === 'lid') && !isIdDef(def)) {
          throw new FosciaError(
            `\`id\` and \`lid\` must be defined with \`id()\` factory (found \`${key}\`).`,
          );
        }

        def.boot?.(this);

        return { [key]: def };
      });

      defineProperty(this, '$schema', { get: () => $schema });

      return $schema;
    },
  });

  model.configure = function configureModel(newConfig?: ModelConfig, override = true) {
    return makeModelClass(
      this.$type,
      mergeConfig(this.$config, newConfig ?? {}, override),
      mergeHooks(this.$hooks!),
      definition,
      this,
    );
  };

  model.extend = function extendModel(rawDefinition?: object) {
    return makeModelClass(
      this.$type,
      this.$config,
      mergeHooks(this.$hooks!),
      { ...definition, ...(rawDefinition ?? {}) },
      this,
    ) as any;
  };

  const applyDefinition = (
    currentDefinition: object,
  ) => eachDescriptors(currentDefinition, (key, descriptor) => {
    if (isComposable(descriptor.value)) {
      model.$composables.push(descriptor.value);

      applyDefinition(descriptor.value.def);

      model.$hooks = mergeHooks(model.$hooks!, descriptor.value.$hooks!);
    } else if (isPropFactory(descriptor.value)) {
      propFactories.set(key, descriptor.value);
    } else {
      defineProperty(model.prototype, key, descriptor);
    }
  });

  applyDefinition(makeDefinition(definition));

  model.$hooks = mergeHooks(model.$hooks!, hooks);

  return model;
};

export default makeModelClass;
