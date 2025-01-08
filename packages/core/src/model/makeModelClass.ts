import FosciaError from '@foscia/core/errors/fosciaError';
import mergeHooks from '@foscia/core/hooks/mergeHooks';
import runHooksSync from '@foscia/core/hooks/runHooksSync';
import { HooksRegistrar } from '@foscia/core/hooks/types';
import isComposable from '@foscia/core/model/checks/isComposable';
import isIdDef from '@foscia/core/model/checks/isIdDef';
import isPropFactory from '@foscia/core/model/checks/isPropFactory';
import makeDefinition from '@foscia/core/model/makeDefinition';
import id from '@foscia/core/model/props/builders/id';
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

const createModelClass = (
  type: string,
  config: ModelConfig,
  hooks: HooksRegistrar<ModelHooksDefinition>,
  definition: object,
  PrevModelClass?: ExtendableModel,
) => {
  if (type.length === 0) {
    throw new FosciaError('Model type cannot be an empty string.');
  }

  const ModelClass = PrevModelClass ? class extends PrevModelClass {
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

  defineProperty(ModelClass, '$FOSCIA_TYPE', { value: SYMBOL_MODEL_CLASS });
  defineProperty(ModelClass, '$type', { value: type });
  defineProperty(ModelClass, '$config', { value: { ...config } });
  defineProperty(ModelClass, '$composables', { value: [] });
  defineProperty(ModelClass, '$hooks', { writable: true, value: {} });
  defineProperty(ModelClass, '$booted', { writable: true, value: false });

  defineProperty(ModelClass, '$schema', {
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

  ModelClass.configure = function configureModel(newConfig?: ModelConfig, override = true) {
    return createModelClass(
      this.$type,
      mergeConfig(this.$config, newConfig ?? {}, override),
      mergeHooks(this.$hooks!),
      definition,
      this,
    );
  };

  ModelClass.extend = function extendModel(rawDefinition?: object) {
    return createModelClass(
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
      ModelClass.$composables.push(descriptor.value);

      applyDefinition(descriptor.value.def);

      ModelClass.$hooks = mergeHooks(ModelClass.$hooks!, descriptor.value.$hooks!);
    } else if (isPropFactory(descriptor.value)) {
      propFactories.set(key, descriptor.value);
    } else {
      defineProperty(ModelClass.prototype, key, descriptor);
    }
  });

  applyDefinition(makeDefinition(definition));

  ModelClass.$hooks = mergeHooks(ModelClass.$hooks!, hooks);

  return ModelClass;
};

export default (
  type: string,
  config: ModelConfig,
  hooks: HooksRegistrar<ModelHooksDefinition>,
  definition: object,
) => createModelClass(type, config, hooks, { id: id(), lid: id(), ...definition });
