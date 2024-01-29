import FosciaError from '@foscia/core/errors/fosciaError';
import runHooksSync from '@foscia/core/hooks/runHooksSync';
import { HooksRegistrar } from '@foscia/core/hooks/types';
import logger from '@foscia/core/logger/logger';
import isIdDef from '@foscia/core/model/checks/isIdDef';
import isPropDef from '@foscia/core/model/checks/isPropDef';
import forceFill from '@foscia/core/model/forceFill';
import makeDefinition from '@foscia/core/model/makeDefinition';
import id from '@foscia/core/model/props/builders/id';
import takeSnapshot from '@foscia/core/model/snapshots/takeSnapshot';
import {
  ExtendableModel,
  ModelAttribute,
  ModelConfig,
  ModelHooksDefinition,
  ModelInstance,
  ModelRelation,
} from '@foscia/core/model/types';
import { SYMBOL_MODEL_CLASS, SYMBOL_MODEL_INSTANCE } from '@foscia/core/symbols';
import { eachDescriptors, isNil, mergeConfig, value } from '@foscia/shared';

const computeDefault = (instance: ModelInstance, def: ModelAttribute | ModelRelation) => {
  if (def.default && typeof def.default === 'object') {
    logger.warn(
      `Default \`${instance.$model.$type}.${def.key}\` object attribute's values must be defined using a factory function.`,
    );
  }

  return value(def.default);
};

const createModelClass = (
  type: string,
  config: ModelConfig,
  definition: object,
  hooks: HooksRegistrar<ModelHooksDefinition> | null,
) => {
  const ModelClass = function ModelConstructor(this: ModelInstance) {
    Object.defineProperty(this, '$FOSCIA_TYPE', { value: SYMBOL_MODEL_INSTANCE });
    Object.defineProperty(this, '$model', { value: this.constructor });
    Object.defineProperty(this, '$exists', { writable: true, value: false });
    Object.defineProperty(this, '$raw', { writable: true, value: null });
    Object.defineProperty(this, '$loaded', { writable: true, value: {} });
    Object.defineProperty(this, '$values', { writable: true, value: {} });
    Object.defineProperty(this, '$original', { writable: true, value: takeSnapshot(this) });

    Object.values(this.$model.$schema).forEach((def) => {
      Object.defineProperty(this, def.key, {
        enumerable: true,
        get: () => {
          const readingHookEvent = { instance: this, def, value: this.$values[def.key] };
          runHooksSync(this.$model, `property:reading:${def.key}`, readingHookEvent);
          runHooksSync(this.$model, 'property:reading', readingHookEvent);

          const currentValue = this.$values[def.key];
          if (
            currentValue === undefined
            && (this.$model.$config.strictProperties ?? this.$model.$config.strict ?? false)
          ) {
            throw new FosciaError(
              `\`${this.$model.$type}.${def.key}\` value was not retrieved from the data source and model uses strict properties.`,
            );
          }

          const readHookEvent = { instance: this, def, value: currentValue };
          runHooksSync(this.$model, `property:read:${def.key}`, readHookEvent);
          runHooksSync(this.$model, 'property:read', readHookEvent);

          return currentValue;
        },
        set: (next) => {
          const writeHookEvent = { instance: this, def, prev: this.$values[def.key], next };

          runHooksSync(this.$model, `property:writing:${def.key}`, writeHookEvent);
          runHooksSync(this.$model, 'property:writing', writeHookEvent);

          if (
            def.readOnly
            && (this.$model.$config.strictReadOnly ?? this.$model.$config.strict ?? true)
          ) {
            throw new FosciaError(
              `\`${this.$model.$type}.${def.key}\` cannot be set because it is read-only.`,
            );
          }

          this.$values[def.key] = next;

          runHooksSync(this.$model, `property:write:${def.key}`, writeHookEvent);
          runHooksSync(this.$model, 'property:write', writeHookEvent);
        },
      });

      if (def.default !== undefined) {
        forceFill(this, { [def.key]: computeDefault(this, def) });
      }
    });
  } as unknown as ExtendableModel;

  Object.defineProperty(ModelClass, '$FOSCIA_TYPE', { value: SYMBOL_MODEL_CLASS });
  Object.defineProperty(ModelClass, '$type', { value: type });
  Object.defineProperty(ModelClass, '$config', { value: { ...config } });
  Object.defineProperty(ModelClass, '$schema', { value: {} });
  Object.defineProperty(ModelClass, '$hooks', {
    writable: true,
    value: Object.entries(hooks ?? {}).reduce((newHooks, [hook, callbacks]) => ({
      ...newHooks,
      [hook]: [...(callbacks ?? [])],
    }), {}),
  });

  ModelClass.configure = (newConfig: ModelConfig, override = true) => createModelClass(
    ModelClass.$type,
    mergeConfig(ModelClass.$config, newConfig, override),
    definition,
    ModelClass.$hooks,
  );

  ModelClass.extend = (rawDefinition?: object) => createModelClass(
    ModelClass.$type,
    ModelClass.$config,
    { ...definition, ...(rawDefinition ?? {}) },
    ModelClass.$hooks,
  );

  eachDescriptors(makeDefinition(definition), (key, descriptor) => {
    if (key === 'type') {
      throw new FosciaError(
        '`type` is forbidden as a definition key because it may be used with some implementations.',
      );
    }

    if ((key === 'id' || key === 'lid') && !isIdDef(descriptor.value)) {
      throw new FosciaError(
        `\`id\` and \`lid\` must be defined with \`id()\` factory (found \`${key}\`).`,
      );
    }

    if (!isNil(descriptor.value) && isPropDef(descriptor.value)) {
      ModelClass.$schema[key] = descriptor.value;
    } else {
      Object.defineProperty(ModelClass.prototype, key, descriptor);
    }
  });

  return ModelClass;
};

export default function makeModelClass(type: string, config: ModelConfig) {
  return createModelClass(type, config, { id: id(), lid: id() }, {});
}
