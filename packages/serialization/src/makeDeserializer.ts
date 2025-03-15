import {
  Action,
  aliasPropKey,
  attachRelationInverse,
  consumeActionKind,
  consumeCache,
  consumeId,
  consumeInstance,
  consumeLazyEagerLoadCallback,
  consumeModel,
  consumeQueryAs,
  consumeRegistry,
  consumeRelation,
  DeserializedData,
  DeserializerError,
  forceFill,
  isRelation,
  isSame,
  markSynced,
  Model,
  ModelInstance,
  ModelProp,
  ModelRelation,
  resolveConnectionName,
  resolveContextModels,
  runHooks,
  shouldSync,
} from '@foscia/core';
import {
  DeserializerContext,
  DeserializerExtract,
  DeserializerInstancesMap,
  DeserializerModelIdentifier,
  DeserializerRecord,
  RecordDeserializer,
  RecordDeserializerConfig,
} from '@foscia/serialization/types';
import {
  type Arrayable,
  isNil,
  mapArrayable,
  multimapGet,
  multimapSet,
  wrap,
} from '@foscia/shared';

// eslint-disable-next-line max-len
/* eslint no-param-reassign: ["error",  { "props": true, "ignorePropertyModificationsForRegex": ["^instance"] } ] */

/**
 * Make a {@link RecordDeserializer | `RecordDeserializer`} using the given config.
 *
 * @param config
 *
 * @category Factories
 */
export default <
  Record,
  Data,
  Deserialized extends DeserializedData,
  Extract extends DeserializerExtract<Record>,
>(config: RecordDeserializerConfig<Record, Data, Deserialized, Extract>) => {
  const NON_IDENTIFIED_LOCAL_ID = '__foscia_non_identified_local_id__';

  let deserializer: RecordDeserializer<Record, Data, Deserialized, Extract>;

  const shouldDeserialize = async (
    context: DeserializerContext<Record, Data, Deserialized, Extract>,
  ) => (
    shouldSync(context.prop, 'pull')
    && await (config.shouldDeserialize ?? (() => context.value !== undefined))(context)
  );

  const deserializeKey = config.deserializeKey
    ?? ((context) => aliasPropKey(context.prop));

  const deserializeAttributeValue = config.deserializeAttribute
    ?? ((context) => (context.prop.transformer?.deserialize ?? ((v) => v))(context.value));

  const deserializeRelated = config.deserializeRelated
    ?? ((context, related, instancesMap) => context.deserializer.deserializeRecord(
      related,
      context.action,
      instancesMap,
    ));

  const deserializeRelationValue = async (
    context: DeserializerContext<Record, Data, Deserialized, Extract, ModelRelation>,
    instancesMap: DeserializerInstancesMap,
  ) => mapArrayable(context.value, (related) => deserializeRelated(
    context,
    related as DeserializerRecord<Record, Data, Deserialized, Extract>,
    instancesMap,
  ));

  const makeDeserializerContext = async <Prop extends ModelProp | ModelRelation>(
    instance: ModelInstance,
    prop: Prop,
    record: DeserializerRecord<Record, Data, Deserialized, Extract>,
    action: Action,
  ) => {
    const deserializerContext = {
      instance,
      prop,
      key: prop.key,
      value: instance[prop.key],
      action,
      extract: record.extract,
      deserializer,
    };

    const key = await deserializeKey(deserializerContext);

    return {
      ...deserializerContext,
      key,
      value: await record.pull({ ...deserializerContext, key }),
    };
  };

  const makeModelIdentifier = async (
    record: DeserializerRecord<Record, Data, Deserialized, Extract>,
    action: Action,
  ): Promise<DeserializerModelIdentifier> => {
    const deserializeId = async (FoundModel: Model, key: 'id' | 'lid') => {
      const deserializerContext = await makeDeserializerContext(
        new FoundModel(),
        FoundModel.$schema[key],
        record,
        action,
      );

      return await shouldDeserialize(deserializerContext)
        ? deserializeAttributeValue(deserializerContext)
        : undefined;
    };

    const fullFillIdentifier = async (model: Model) => ({
      model,
      id: await deserializeId(model, 'id'),
      lid: await deserializeId(model, 'lid'),
    });

    // Try to resolve the model directly from the type when possible.
    // This will provide support for polymorphism and registry based
    // actions.
    const registry = await consumeRegistry(action, null);
    if (registry && !isNil(record.type)) {
      const model = await registry.resolve(`${await resolveConnectionName(action)}:${record.type}`);
      if (model) {
        return fullFillIdentifier(model);
      }
    }

    // When no registry is configured or identifier type was not retrieved,
    // we'll try to resolve the model from the context.
    // This will also ensure guessed model type matches deserializing record.
    const models = await resolveContextModels({
      queryAs: await consumeQueryAs(action, null),
      model: (record.parent?.instance.$model ?? await consumeModel(action, null)),
      relation: record.parent?.prop ?? await consumeRelation(action, null),
      registry,
    });
    const model = record.type
      ? models.find((m) => m.$type === record.type)
      : models[0];
    if (!model) {
      throw new DeserializerError(
        `Could not resolve model for type \`${record.type}\`, did you forget defining explicit related models or a registry?`,
      );
    }

    return fullFillIdentifier(model);
  };

  const findInstance = async (
    identifier: DeserializerModelIdentifier,
    action: Action,
  ) => {
    const cache = await consumeCache(action, null);
    if (cache && !isNil(identifier.id)) {
      return cache.find(
        `${identifier.model.$connection}:${identifier.model.$type}`,
        identifier.id,
      );
    }

    const instance = await consumeInstance(action, null);

    return instance
    && identifier.id === instance.id
    && identifier.model.$type === instance.$model.$type
      ? instance : null;
  };

  const findOrMakeInstance = async (
    identifier: DeserializerModelIdentifier,
    action: Action,
  ): Promise<ModelInstance> => (
    // eslint-disable-next-line new-cap
    await findInstance(identifier, action) ?? new identifier.model()
  );

  const makeInstancesMapIdentifier = (identifier: DeserializerModelIdentifier) => (
    identifier.id ?? identifier.lid ?? NON_IDENTIFIED_LOCAL_ID
  );

  const deserializeRecordIn = async (
    record: DeserializerRecord<Record, Data, Deserialized, Extract>,
    identifier: DeserializerModelIdentifier,
    instance: ModelInstance,
    action: Action,
    instancesMap: DeserializerInstancesMap,
  ) => {
    const setInstanceId = (key: 'id' | 'lid') => {
      const newId = identifier[key] ?? instance[key];
      if (newId !== instance[key]) {
        forceFill(instance, { [key]: newId });
      }
    };

    setInstanceId('id');
    setInstanceId('lid');

    await Promise.all(Object.values(instance.$model.$schema).map(async (prop) => {
      const isRelationProp = isRelation(prop);
      const deserializerContext = await makeDeserializerContext(
        instance,
        prop,
        record,
        action,
      );
      if (await shouldDeserialize(deserializerContext)) {
        const value = isRelationProp ? await deserializeRelationValue(
          // eslint-disable-next-line max-len
          deserializerContext as DeserializerContext<Record, Data, Deserialized, Extract, ModelRelation>,
          instancesMap,
        ) : await deserializeAttributeValue(deserializerContext);

        forceFill(instance, { [prop.key]: value });

        if (isRelationProp) {
          instance.$loaded[prop.key] = true;
          attachRelationInverse(instance, prop, wrap(value));
        }
      }
    }));

    const actionKind = await consumeActionKind(action, null);

    instance.$exists = !(actionKind === 'destroy' && (
      isSame(instance, await consumeInstance(action, null)) || (
        instance.$model === await consumeModel(action, null)
        && instance.id === await consumeId(action, null)
      )
    ));
    instance.$raw = record.raw;

    return instance;
  };

  const deserializeRecord = async (
    record: DeserializerRecord<Record, Data, Deserialized, Extract>,
    action: Action,
    instancesMap: DeserializerInstancesMap = new Map(),
  ) => {
    const identifier = await makeModelIdentifier(record, action);
    const mapIdentifier = makeInstancesMapIdentifier(identifier);

    let instancePromise = multimapGet(instancesMap, [identifier.model.$type, mapIdentifier]);
    if (instancePromise) {
      return instancePromise;
    }

    multimapSet(
      instancesMap,
      [identifier.model.$type, mapIdentifier],
      instancePromise = findOrMakeInstance(identifier, action),
    );

    return deserializeRecordIn(
      record,
      identifier,
      await instancePromise,
      action,
      instancesMap,
    );
  };

  const prepareInstancesMap = async (
    records: Arrayable<DeserializerRecord<Record, Data, Deserialized, Extract>> | null,
    action: Action,
    instancesMap: DeserializerInstancesMap,
  ) => {
    // Handle a singular creation context to map a non-identified instance
    // to the single returned resource if available.
    const actionKind = await consumeActionKind(action, null);
    const instance = await consumeInstance(action, null);
    if (actionKind === 'create'
      && instance
      && records
      && !Array.isArray(records)
    ) {
      const identifier = await makeModelIdentifier(records, action);
      const mapIdentifier = makeInstancesMapIdentifier(identifier);

      multimapSet(
        instancesMap,
        [identifier.model.$type, mapIdentifier],
        deserializeRecordIn(records, identifier, instance, action, instancesMap),
      );
    }
  };

  const releaseInstancesMap = (
    action: Action,
    instancesMap: DeserializerInstancesMap,
  ) => Promise.all(Array.from(
    instancesMap.values(),
    (instancesByIds) => Promise.all(Array.from(
      instancesByIds.values(),
      async (instancePromise) => {
        const instance = await instancePromise;

        markSynced(instance);
        await runHooks(instance.$model, 'retrieved', instance);

        const cache = await consumeCache(action, null);
        if (cache && !isNil(instance.id)) {
          await cache.put(
            `${instance.$model.$connection}:${instance.$model.$type}`,
            instance.id,
            instance,
          );
        }
      },
    )),
  ));

  const deserialize = async (data: Data, action: Action) => {
    const extract = await config.extractData(data, action);
    const records = await mapArrayable(
      extract.records,
      (record) => config.createRecord(extract, record),
    ) ?? null;

    const instancesMap: DeserializerInstancesMap = new Map();

    await prepareInstancesMap(records, action, instancesMap);

    const instances = await Promise.all(wrap(records).map(async (record) => deserializeRecord(
      record,
      action,
      instancesMap,
    )));

    if (instances.length) {
      const parent = await consumeInstance(action, null);
      const relation = await consumeRelation(action, null);
      if (parent && relation) {
        attachRelationInverse(parent, relation, instances);
      }

      const lazyEagerLoadCallback = await consumeLazyEagerLoadCallback(action, null);
      await lazyEagerLoadCallback?.(instances);
    }

    await releaseInstancesMap(action, instancesMap);

    return (
      config.createData ? config.createData(instances, extract, action) : { instances }
    ) as Deserialized;
  };

  deserializer = {
    deserialize,
    deserializeRecord,
  };

  return { deserializer };
};
