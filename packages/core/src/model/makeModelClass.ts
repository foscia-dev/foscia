import FosciaError from '@foscia/core/errors/fosciaError';
import logger from '@foscia/core/logger/logger';
import isIdDef from '@foscia/core/model/checks/isIdDef';
import isPropDef from '@foscia/core/model/checks/isPropDef';
import makeDefinition from '@foscia/core/model/makeDefinition';
import id from '@foscia/core/model/props/builders/id';
import takeSnapshot from '@foscia/core/model/snapshots/takeSnapshot';
import {
  Model,
  ModelAttribute,
  ModelConfig,
  ModelInstance,
  ModelRelation,
} from '@foscia/core/model/types';
import { SYMBOL_MODEL_CLASS, SYMBOL_MODEL_INSTANCE } from '@foscia/core/symbols';
import { applyConfig, eachDescriptors, isNil, value } from '@foscia/shared';

export default function makeModelClass(type: string, config: ModelConfig) {
  const computeDefault = (instance: ModelInstance, def: ModelAttribute | ModelRelation) => {
    if (def.default && typeof def.default === 'object') {
      logger.warn(
        `Default \`${instance.$model.$type}.${def.key}\` object attribute's values must be defined using a factory function.`,
      );
    }

    return value(def.default);
  };

  const ModelClass = function ModelConstructor(this: ModelInstance) {
    Object.defineProperty(this, '$FOSCIA_TYPE', { value: SYMBOL_MODEL_INSTANCE });
    Object.defineProperty(this, '$model', { value: this.constructor });
    Object.defineProperty(this, '$exists', { writable: true, value: false });
    Object.defineProperty(this, '$raw', { writable: true, value: null });
    Object.defineProperty(this, '$loaded', { writable: true, value: {} });
    Object.defineProperty(this, '$values', { writable: true, value: {} });
    Object.defineProperty(this, '$original', { writable: true, value: takeSnapshot(this) });

    Object.values(ModelClass.$schema).forEach((def) => {
      Object.defineProperty(this, def.key, {
        enumerable: true,
        get: () => {
          const currentValue = this.$values[def.key];
          if (
            currentValue === undefined
            && (this.$model.$config.strictProperties ?? this.$model.$config.strict)
          ) {
            throw new FosciaError(
              `\`${this.$model.$type}.${def.key}\` value was not retrieved from the data source and model uses strict properties.`,
            );
          }

          return currentValue;
        },
        set: (nextValue) => {
          if (def.readOnly) {
            throw new FosciaError(
              `\`${this.$model.$type}.${def.key}\` cannot be set because it is read-only.`,
            );
          }

          this.$values[def.key] = nextValue;
        },
      });

      if (def.default !== undefined) {
        this.$values[def.key] = computeDefault(this, def);
      }
    });
  } as unknown as Model;

  Object.defineProperty(ModelClass, '$FOSCIA_TYPE', { value: SYMBOL_MODEL_CLASS });
  Object.defineProperty(ModelClass, '$type', { value: type });
  Object.defineProperty(ModelClass, '$config', { value: config });
  Object.defineProperty(ModelClass, '$schema', { value: {} });
  Object.defineProperty(ModelClass, '$hooks', { writable: true, value: {} });

  ModelClass.configure = (rawConfig: ModelConfig, override = true) => {
    applyConfig(ModelClass.$config, rawConfig, override);
  };

  ModelClass.extends = (rawDefinition?: object) => {
    eachDescriptors(rawDefinition ?? {}, (key, descriptor) => {
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

  ModelClass.extends(makeDefinition({
    id: id(),
    lid: id(),
  }));

  return ModelClass;
}
