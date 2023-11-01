/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  changed,
  mapAttributes,
  mapRelations,
  ModelAttribute,
  ModelInstance,
  ModelRelation,
  normalizeKey,
  SerializerError,
  SerializerI,
  shouldSync,
} from '@foscia/core';
import { ObjectSerializerConfig } from '@foscia/object/types';
import { applyConfig } from '@foscia/shared';

export default abstract class ObjectSerializer<Data> implements SerializerI<Data> {
  public constructor(config?: ObjectSerializerConfig) {
    this.configure(config ?? {});
  }

  public configure(config: ObjectSerializerConfig, override = true) {
    applyConfig(this, config, override);
  }

  public async serialize(instance: ModelInstance, context: {}) {
    const resource = await this.makeResource(instance, context);

    await Promise.all(mapAttributes(instance, async (def) => {
      const rawValue = instance[def.key];
      if (await this.shouldSerializeAttribute(instance, def, rawValue, context)) {
        const serializedKey = await this.serializeAttributeKey(instance, def, context);
        const serializedValue = await this.serializeAttributeValue(
          instance,
          def,
          rawValue,
          context,
        );

        await this.hydrateAttributeInResource(resource, serializedKey, serializedValue);
      }
    }));

    await Promise.all(mapRelations(instance, async (def) => {
      const rawValue = instance[def.key];
      if (await this.shouldSerializeRelation(instance, def, rawValue, context)) {
        const serializedKey = await this.serializeRelationKey(instance, def, context);
        const serializedValue = await this.serializeRelationValue(
          instance,
          def,
          rawValue,
          context,
        );

        await this.hydrateRelationInResource(resource, serializedKey, serializedValue);
      }
    }));

    return resource;
  }

  protected abstract makeResource(instance: ModelInstance, context: {}): Promise<Data>;

  protected abstract serializeRelatedInstance(
    instance: ModelInstance,
    def: ModelRelation,
    related: ModelInstance,
    context: {},
  ): Promise<unknown>;

  protected hydratePropInResource(
    _resource: Data,
    _serializedKey: string,
    _serializedValue: unknown,
  ): Promise<void> {
    throw new SerializerError(
      'You should either implement `hydratePropInResource` or `hydrateAttributeInResource` and `hydrateRelationInResource` in your JsonSerializer implementation.',
    );
  }

  protected async hydrateAttributeInResource(
    resource: Data,
    serializedKey: string,
    serializedValue: unknown,
  ) {
    await this.hydratePropInResource(resource, serializedKey, serializedValue);
  }

  protected async hydrateRelationInResource(
    resource: Data,
    serializedKey: string,
    serializedValue: unknown,
  ) {
    await this.hydratePropInResource(resource, serializedKey, serializedValue);
  }

  protected async serializeAttributeKey(
    instance: ModelInstance,
    def: ModelAttribute,
    _context: {},
  ) {
    return normalizeKey(instance.$model, def.key);
  }

  protected async serializeRelationKey(
    instance: ModelInstance,
    def: ModelRelation,
    _context: {},
  ) {
    return normalizeKey(instance.$model, def.key);
  }

  protected shouldSerializeAttribute(
    instance: ModelInstance,
    def: ModelAttribute,
    rawValue: unknown,
    context: {},
  ) {
    return this.shouldSerializeProp(instance, def, rawValue, context);
  }

  protected shouldSerializeRelation(
    instance: ModelInstance,
    def: ModelRelation,
    rawValue: unknown,
    context: {},
  ) {
    return this.shouldSerializeProp(instance, def, rawValue, context);
  }

  protected async shouldSerializeProp(
    instance: ModelInstance,
    def: ModelAttribute | ModelRelation,
    rawValue: unknown,
    _context: {},
  ) {
    return shouldSync(def, ['push'])
      && rawValue !== undefined
      && changed(instance, def.key);
  }

  protected async serializeAttributeValue(
    _instance: ModelInstance,
    def: ModelAttribute,
    rawValue: unknown,
    _context: {},
  ) {
    return def.transformer ? def.transformer.serialize(rawValue) : rawValue;
  }

  protected async serializeRelationValue(
    instance: ModelInstance,
    def: ModelRelation,
    rawValue: unknown,
    context: {},
  ) {
    const serializeRelatedInstance = (related: ModelInstance) => this.serializeRelatedInstance(
      instance,
      def,
      related,
      context,
    );
    if (Array.isArray(rawValue)) {
      return Promise.all(rawValue.map(serializeRelatedInstance));
    }

    if (rawValue) {
      return serializeRelatedInstance(rawValue as ModelInstance);
    }

    return rawValue;
  }
}
