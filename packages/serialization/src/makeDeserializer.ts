import {
  attachRelationInverse,
  consumeAction,
  consumeCache,
  consumeId,
  consumeInstance,
  consumeModel,
  consumeQueryAs,
  consumeRegistry,
  consumeRelation,
  DeserializedData,
  DeserializerError,
  forceFill,
  guessContextModel,
  isSame,
  mapAttributes,
  mapRelations,
  markSynced,
  ModelAttribute,
  ModelInstance,
  ModelRelation,
  normalizeKey,
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
  Awaitable,
  isNil,
  isNone,
  makeIdentifiersMap,
  mapArrayable,
  using,
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

  const makeModelIdentifier = async (
    record: DeserializerRecord<Record, Data, Deserialized>,
    context: {},
  ): Promise<DeserializerModelIdentifier> => {
    const identifier = { ...record.identifier };

    // Try to resolve the model directly from the type when possible.
    // This will provide support for polymorphism and registry based
    // actions.
    const registry = await consumeRegistry(context, null);
    if (registry && !isNil(identifier.type)) {
      const model = await registry.modelFor(identifier.type);
      if (model) {
        return { ...identifier, type: model.$type, model };
      }
    }

    // When no registry is configured or identifier type was not retrieved,
    // we'll try to resolve the model from the context.
    // This will also ensure guessed model type matches deserializing record.
    const guessedModel = await guessContextModel({
      queryAs: consumeQueryAs(context, null),
      model: (record.parent?.instance.$model ?? consumeModel(context, null)),
      relation: record.parent?.def ?? consumeRelation(context, null),
      registry,
      ensureType: identifier.type,
    });

    if (!guessedModel) {
      if (isNil(identifier.type)) {
        throw new DeserializerError(`
No alternative found to resolve model of resource with ID \`${identifier.id}\`.
You should either:
  - Query a model/instance/relation using \`query\` enhancer.
  - Define explicit related model/type on your relations.
  - Define a registry to hold types to models mapping.
  - Manage type extraction in the deserialization process.
`.trim());
      }

      throw new DeserializerError(`
No alternative found to resolve model of resource with ID \`${identifier.id}\` and type \`${identifier.type}\`.
You should either:
  - Query a model/instance/relation using \`query\` enhancer.
  - Define explicit related model/type on your relations.
  - Define a registry to hold types to models mapping.
`.trim());
    }

    return { ...identifier, type: identifier.type ?? guessedModel.$type, model: guessedModel };
  };

  const findInstance = async (
    identifier: DeserializerModelIdentifier,
    context: {},
  ) => using(await consumeCache(context, null), (cache) => (
    cache && !isNil(identifier.id)
      ? cache.find(identifier.model.$type, identifier.id)
      : using(consumeInstance(context, null), (instance) => (
        instance
        && identifier.id === instance.id
        && identifier.model.$type === instance.$model.$type
          ? instance
          : null
      ))
  ));

  const findOrMakeInstance = async (
    identifier: DeserializerModelIdentifier,
    context: {},
  ): Promise<ModelInstance> => (
    // eslint-disable-next-line new-cap
    await findInstance(identifier, context) ?? new identifier.model()
  );

  const shouldDeserialize = async (context: DeserializerContext<Record, Data, Deserialized>) => (
    shouldSync(context.def, 'pull')
    && context.value !== undefined
    && await (config.shouldDeserialize ?? (() => true))(context)
  );

  const deserializeKey = config.deserializeKey
    ?? ((context) => normalizeKey(context.instance.$model, context.def.key));

  const deserializeAttributeValue = config.deserializeAttribute
    ?? ((context) => (context.def.transformer?.deserialize ?? ((v) => v))(context.value));

  const deserializeRelated = config.deserializeRelated
    ?? ((context, related, instancesMap) => context.deserializer.deserializeRecord(
      related,
      context.context,
      instancesMap,
    ));

  const deserializeRelationValue = async (
    context: DeserializerContext<Record, Data, Deserialized, ModelRelation>,
    instancesMap: DeserializerInstancesMap,
  ) => mapArrayable(context.value, (related) => deserializeRelated(
    context,
    related as DeserializerRecord<Record, Data, Deserialized>,
    instancesMap,
  ));

  let deserializer: RecordDeserializer<Record, Data, Deserialized>;

  const makeInstancesMapIdentifier = (identifier: DeserializerModelIdentifier) => (
    identifier.id ?? identifier.lid ?? NON_IDENTIFIED_LOCAL_ID
  );

  const makeInstancesMap = (): DeserializerInstancesMap => makeIdentifiersMap();

  const makeDeserializerContext = async <Def extends ModelAttribute | ModelRelation, Value>(
    instance: ModelInstance,
    def: Def,
    pull: (context: DeserializerContext<Record, Data, Deserialized, Def>) => Awaitable<Value>,
    context: {},
  ) => {
    const deserializerContext = {
      instance,
      def,
      key: def.key,
      value: instance[def.key],
      context,
      deserializer,
    };

    const key = await deserializeKey(deserializerContext);

    return {
      ...deserializerContext,
      key,
      value: await pull({ ...deserializerContext, key }),
    };
  };

  const deserializeRecordIn = async (
    record: DeserializerRecord<Record, Data, Deserialized>,
    identifier: DeserializerModelIdentifier,
    instance: ModelInstance,
    context: {},
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

    await Promise.all(Object.values({
      ...mapAttributes(instance.$model, async (def) => {
        const deserializerContext = await makeDeserializerContext(
          instance,
          def,
          record.pullAttribute,
          context,
        );
        if (await shouldDeserialize(deserializerContext)) {
          forceFill(instance, { [def.key]: await deserializeAttributeValue(deserializerContext) });
        }
      }),
      ...mapRelations(instance.$model, async (def) => {
        const deserializerContext = await makeDeserializerContext(
          instance,
          def,
          record.pullRelation,
          context,
        );
        if (await shouldDeserialize(deserializerContext)) {
          const related = await deserializeRelationValue(deserializerContext, instancesMap);

          forceFill(instance, { [def.key]: related });

          instance.$loaded[def.key] = true;

          attachRelationInverse(instance, def, wrap(related));
        }
      }),
    }));

    const action = consumeAction(context, null);

    instance.$exists = !(action === 'destroy' && (
      isSame(instance, consumeInstance(context, null)) || (
        instance.$model === consumeModel(context, null) && instance.id === consumeId(context, null)
      )
    ));
    instance.$raw = record.raw;

    return instance;
  };

  const deserializeRecord = async (
    record: DeserializerRecord<Record, Data, Deserialized>,
    context: {},
    instancesMap: DeserializerInstancesMap = makeInstancesMap(),
  ) => {
    const identifier = await makeModelIdentifier(record, context);
    const mapIdentifier = makeInstancesMapIdentifier(identifier);

    let instancePromise = instancesMap.find(identifier.model.$type, mapIdentifier);
    if (instancePromise) {
      return instancePromise;
    }

    instancesMap.put(
      identifier.model.$type,
      mapIdentifier,
      instancePromise = findOrMakeInstance(identifier, context),
    );

    return deserializeRecordIn(record, identifier, await instancePromise, context, instancesMap);
  };

  const prepareInstancesMap = async (
    records: Arrayable<DeserializerRecord<Record, Data, Deserialized>> | null,
    context: {},
    instancesMap: DeserializerInstancesMap,
  ) => {
    // Handle a singular creation context to map a non-identified instance
    // to the single returned resource if available.
    const action = consumeAction(context, null);
    const instance = consumeInstance(context, null);
    if (action === 'create'
      && instance
      && !isNone(records)
      && !Array.isArray(records)
    ) {
      const identifier = await makeModelIdentifier(records, context);
      const mapIdentifier = makeInstancesMapIdentifier(identifier);

      instancesMap.put(
        identifier.model.$type,
        mapIdentifier,
        deserializeRecordIn(records, identifier, instance, context, instancesMap),
      );
    }
  };

  const releaseInstancesMap = (
    context: {},
    instancesMap: DeserializerInstancesMap,
  ) => Promise.all(instancesMap.all().map(async (instancePromise) => {
    const instance = await instancePromise;

    markSynced(instance);
    await runHooks(instance.$model, 'retrieved', instance);

    const cache = await consumeCache(context, null);
    if (cache && !isNil(instance.id)) {
      await cache.put(instance.$model.$type, instance.id, instance);
    }
  }));

  const deserialize = async (data: Data, context: {}) => {
    const extract = await config.extractData(data, context);
    const records = await mapArrayable(
      extract.records,
      (record) => config.createRecord(extract, record, context),
    ) ?? null;

    const instancesMap = makeInstancesMap();

    await prepareInstancesMap(records, context, instancesMap);

    const instances = await Promise.all(wrap(records).map(async (record) => deserializeRecord(
      record,
      context,
      instancesMap,
    )));

    const parent = consumeInstance(context, null);
    const relation = consumeRelation(context, null);
    if (parent && relation) {
      attachRelationInverse(parent, relation, instances);
    }

    await releaseInstancesMap(context, instancesMap);

    return (
      config.createData ? config.createData(instances, extract, context) : { instances }
    ) as Deserialized;
  };

  deserializer = {
    deserialize,
    deserializeRecord,
  };

  return { deserializer };
};
