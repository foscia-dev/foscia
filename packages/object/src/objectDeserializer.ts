/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  consumeAction,
  consumeCache,
  consumeInstance,
  consumeModel,
  consumeRegistry,
  DeserializedData,
  DeserializerError,
  DeserializerI,
  guessContextModel,
  mapAttributes,
  mapRelations,
  markSynced,
  Model,
  ModelAttribute,
  ModelIdType,
  ModelInstance,
  ModelRelation,
  normalizeKey,
  runHook,
  shouldSync,
} from '@foscia/core';
import {
  ObjectDeserializerConfig,
  ObjectExtractedData,
  ObjectNormalizedIdentifier,
  ObjectOptionalIdentifier,
} from '@foscia/object/types';
import { applyConfig, IdentifiersMap, isNil, isNone, Optional, wrap } from '@foscia/shared';

export default abstract class ObjectDeserializer<
  AdapterData,
  Resource,
  Extract extends ObjectExtractedData<Resource> = ObjectExtractedData<Resource>,
  Data extends DeserializedData = DeserializedData,
> implements DeserializerI<AdapterData, Data> {
  protected static NON_IDENTIFIED_LOCAL_ID = '__foscia_non_identified_local_id__';

  public constructor(config?: ObjectDeserializerConfig) {
    this.configure(config ?? {});
  }

  public configure(config: ObjectDeserializerConfig, override = true) {
    applyConfig(this, config, override);
  }

  public async deserialize(data: AdapterData, context: {}) {
    const instancesMap = await this.initInstancesMap();

    const extractedData = await this.extractData(data, context);

    await this.prepareInstancesMap(extractedData, instancesMap, context);

    return this.makeDeserializedData(
      await Promise.all(wrap(extractedData.resources).map(
        (resource) => this.deserializeResource(
          extractedData,
          instancesMap,
          resource,
          context,
        ),
      )),
      extractedData,
    );
  }

  protected abstract makeDeserializedData(
    instances: ModelInstance[],
    extractedData: Extract,
  ): Promise<Data>;

  protected abstract extractData(data: AdapterData, context: {}): Promise<Extract>;

  protected abstract extractOptionalIdentifier(
    resource: Resource,
    context: {},
    parent?: ModelInstance,
    relation?: ModelRelation,
  ): Promise<ObjectOptionalIdentifier>;

  protected async initInstancesMap() {
    return new IdentifiersMap<string, ModelIdType, Promise<ModelInstance>>();
  }

  protected async prepareInstancesMap(
    extractedData: Extract,
    instancesMap: IdentifiersMap<string, ModelIdType, Promise<ModelInstance>>,
    context: {},
  ) {
    // Handle a singular creation context to map a non-identified instance
    // to the single returned resource if available.
    const action = consumeAction(context, null);
    const instance = consumeInstance(context, null);
    if (action === 'create'
      && instance
      && !isNone(extractedData.resources)
      && !Array.isArray(extractedData.resources)
    ) {
      const resource = extractedData.resources;
      const identifier = await this.extractIdentifier(resource, context);

      instancesMap.set(
        identifier.type,
        await this.extractLocalId(resource, identifier, context),
        this.deserializeResourceOnInstance(
          extractedData,
          instancesMap,
          resource,
          identifier,
          instance,
          context,
        ),
      );
    }
  }

  protected async deserializeResource(
    extractedData: Extract,
    instancesMap: IdentifiersMap<string, ModelIdType, Promise<ModelInstance>>,
    resource: Resource,
    context: {},
    parent?: ModelInstance,
    relation?: ModelRelation,
  ) {
    const identifier = await this.extractIdentifier(
      resource,
      context,
      parent,
      relation,
    );

    const localId = await this.extractLocalId(resource, identifier, context);
    let instancePromise = instancesMap.get(identifier.type, localId);
    if (instancePromise) {
      return instancePromise;
    }

    instancesMap.set(
      identifier.type,
      localId,
      instancePromise = this.findOrMakeInstance(resource, identifier, context),
    );

    return this.deserializeResourceOnInstance(
      extractedData,
      instancesMap,
      resource,
      identifier,
      await instancePromise,
      context,
    );
  }

  protected async deserializeResourceOnInstance(
    extractedData: Extract,
    instancesMap: IdentifiersMap<string, ModelIdType, Promise<ModelInstance>>,
    resource: Resource,
    identifier: ObjectNormalizedIdentifier,
    instance: ModelInstance,
    context: {},
  ) {
    const newId = identifier.id ?? instance.id;
    if (newId !== instance.$values.id) {
      // eslint-disable-next-line no-param-reassign
      instance.$values.id = newId;
    }

    const newLid = identifier.lid ?? instance.lid;
    if (newLid !== instance.$values.lid) {
      // eslint-disable-next-line no-param-reassign
      instance.$values.lid = newLid;
    }

    await Promise.all(mapAttributes(instance, async (def) => {
      const serializedKey = await this.serializeAttributeKey(instance, def, context);
      const rawValue = await this.extractAttributeValue(
        extractedData,
        resource,
        serializedKey,
        context,
      );
      if (await this.shouldDeserializeAttribute(instance, def, rawValue, context)) {
        const value = await this.deserializeAttributeValue(instance, def, rawValue, context);

        await this.hydrateAttributeInInstance(instance, def, value);
      }
    }));

    await Promise.all(mapRelations(instance, async (def) => {
      const serializedKey = await this.serializeRelationKey(instance, def, context);
      const rawValue = await this.extractRelationValue(
        extractedData,
        resource,
        serializedKey,
        context,
      );
      if (await this.shouldDeserializeRelation(instance, def, rawValue, context)) {
        const value = await this.deserializeRelationValue(
          extractedData,
          instancesMap,
          instance,
          def,
          rawValue,
          context,
        );

        await this.hydrateRelationInInstance(instance, def, value);
      }
    }));

    await this.releaseInstance(resource, instance, context);

    return instance;
  }

  protected async extractIdentifier(
    resource: Resource,
    context: {},
    parent?: ModelInstance,
    relation?: ModelRelation,
  ): Promise<ObjectNormalizedIdentifier> {
    const identifier = await this.extractOptionalIdentifier(
      resource,
      context,
      parent,
      relation,
    );

    const registry = consumeRegistry(context, null);

    // Try to resolve the model directly from the type when possible.
    // This will provide support for polymorphism and registry based
    // actions.
    if (registry && !isNil(identifier.type)) {
      const model = await registry.modelFor(identifier.type);
      if (model) {
        return { ...identifier, model } as ObjectNormalizedIdentifier;
      }
    }

    // When no registry is configured or identifier type was not retrieved,
    // we'll try to resolve the model from the context.
    const model = consumeModel(context, null);
    const guessedModel = await guessContextModel({
      model: (relation ? parent!.$model : model) as Model,
      relation,
      registry,
    }, true);

    if (!guessedModel) {
      if (isNil(identifier.type)) {
        throw new DeserializerError(
          `No alternative found to resolve model of resource with ID \`${identifier.id}\`. You should either: target a model, give an explicit type to your relation or configure/extends the deserializer to manage types extraction.`,
        );
      }

      throw new DeserializerError(
        `No alternative found to resolve model of resource with ID \`${identifier.id}\` and type \`${identifier.type}\`. You should verify there is a registered model which matches this type in your action factory.`,
      );
    }

    // In some case, a type may be defined in identifier but there
    // was no registry to lookup for model, so we should ensure
    // the looked up model match this type before returning it.
    if (!isNil(identifier.type) && identifier.type !== guessedModel.$type) {
      throw new DeserializerError(
        `Resolved model has type \`${guessedModel.$type}\` but resource with ID \`${identifier.id}\` has type \`${identifier.type}\`. There is probably an error with the context values of your action. If not, you should verify there is a registered model which matches this type in your action factory.`,
      );
    }

    return { ...identifier, type: identifier.type ?? guessedModel.$type, model: guessedModel };
  }

  protected async extractLocalId(
    _resource: Resource,
    identifier: ObjectNormalizedIdentifier,
    _context: {},
  ) {
    return identifier.id ?? identifier.lid ?? ObjectDeserializer.NON_IDENTIFIED_LOCAL_ID;
  }

  protected async findOrMakeInstance(
    resource: Resource,
    identifier: ObjectNormalizedIdentifier,
    context: {},
  ) {
    return await this.findInstance(resource, identifier, context)
      ?? await this.makeInstance(resource, identifier, context);
  }

  protected async findInstance(
    _resource: Resource,
    identifier: ObjectNormalizedIdentifier,
    context: {},
  ): Promise<ModelInstance | null> {
    const cache = consumeCache(context, null);
    if (cache && !isNil(identifier.id)) {
      return cache.find(identifier.type, identifier.id);
    }

    const instance = consumeInstance(context, null);
    if (instance && identifier.id === instance.id && identifier.type === instance.$model.$type) {
      return instance;
    }

    return null;
  }

  protected async makeInstance(
    _resource: Resource,
    identifier: ObjectNormalizedIdentifier,
    _context: {},
  ): Promise<ModelInstance> {
    const ModelClass = identifier.model;

    return new ModelClass();
  }

  protected async releaseInstance(
    resource: Resource,
    instance: ModelInstance,
    context: {},
  ) {
    const action = consumeAction(context, null);

    // eslint-disable-next-line no-param-reassign
    instance.$exists = action !== 'destroy';
    // eslint-disable-next-line no-param-reassign
    instance.$raw = resource;

    markSynced(instance);

    await runHook(instance.$model, 'retrieved', instance);

    const cache = consumeCache(context, null);
    if (cache && !isNil(instance.id)) {
      await cache.put(instance.$model.$type, instance.id, instance);
    }
  }

  protected extractPropValue(
    _resource: Resource,
    _serializedKey: string,
    _context: {},
  ): Promise<unknown> {
    throw new DeserializerError(
      'You should either implement `extractPropValue` or `extractAttributeValue` and `extractRelationValue` in your JsonDeserializer implementation.',
    );
  }

  protected extractAttributeValue(
    _extractedData: Extract,
    resource: Resource,
    serializedKey: string,
    context: {},
  ) {
    return this.extractPropValue(resource, serializedKey, context);
  }

  protected extractRelationValue(
    _extractedData: Extract,
    resource: Resource,
    serializedKey: string,
    context: {},
  ) {
    return this.extractPropValue(
      resource,
      serializedKey,
      context,
    ) as Promise<Optional<Resource[] | Resource>>;
  }

  protected async hydratePropInInstance(
    instance: ModelInstance,
    def: ModelAttribute | ModelRelation,
    value: unknown,
  ) {
    // eslint-disable-next-line no-param-reassign
    instance.$values[def.key] = value;
  }

  protected async hydrateAttributeInInstance(
    instance: ModelInstance,
    def: ModelAttribute,
    value: unknown,
  ) {
    await this.hydratePropInInstance(instance, def, value);
  }

  protected async hydrateRelationInInstance(
    instance: ModelInstance,
    def: ModelRelation,
    value: unknown,
  ) {
    await this.hydratePropInInstance(instance, def, value);

    // eslint-disable-next-line no-param-reassign
    instance.$loaded[def.key] = true;
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

  protected shouldDeserializeAttribute(
    instance: ModelInstance,
    def: ModelAttribute,
    rawValue: unknown,
    context: {},
  ) {
    return this.shouldDeserializeProp(instance, def, rawValue, context);
  }

  protected shouldDeserializeRelation(
    instance: ModelInstance,
    def: ModelRelation,
    rawValue: unknown,
    context: {},
  ) {
    return this.shouldDeserializeProp(instance, def, rawValue, context);
  }

  protected async shouldDeserializeProp(
    _instance: ModelInstance,
    def: ModelAttribute | ModelRelation,
    rawValue: unknown,
    _context: {},
  ) {
    return shouldSync(def, ['pull'])
      && rawValue !== undefined;
  }

  protected async deserializeAttributeValue(
    _instance: ModelInstance,
    def: ModelAttribute,
    rawValue: unknown,
    _context: {},
  ) {
    return def.transformer ? def.transformer.deserialize(rawValue) : rawValue;
  }

  protected async deserializeRelationValue(
    extractedData: Extract,
    instancesMap: IdentifiersMap<string, ModelIdType, Promise<ModelInstance>>,
    instance: ModelInstance,
    def: ModelRelation,
    rawValue: Optional<Resource[] | Resource>,
    context: {},
  ) {
    if (Array.isArray(rawValue)) {
      return Promise.all(rawValue.map((resource) => this.deserializeResource(
        extractedData,
        instancesMap,
        resource,
        context,
        instance,
        def,
      )));
    }

    if (rawValue) {
      return this.deserializeResource(
        extractedData,
        instancesMap,
        rawValue,
        context,
        instance,
        def,
      );
    }

    return rawValue;
  }
}
