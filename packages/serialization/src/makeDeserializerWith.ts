import {
  consumeAction,
  consumeCache,
  consumeInstance,
  consumeModel,
  consumeRegistry,
  consumeRelation,
  DeserializedData,
  DeserializerError,
  forceFill,
  guessContextModel,
  mapAttributes,
  mapRelations,
  markSynced,
  Model,
  ModelAttribute,
  ModelInstance,
  ModelRelation,
  normalizeKey,
  runHooks,
  shouldSync,
} from '@foscia/core';
import {
  Deserializer,
  DeserializerConfig,
  DeserializerContext,
  DeserializerExtract,
  DeserializerInstancesMap,
  DeserializerModelIdentifier,
  DeserializerRecord,
} from '@foscia/serialization/types';
import {
  type Arrayable,
  isNil,
  isNone,
  makeIdentifiersMap,
  mapArrayable,
  wrap,
} from '@foscia/shared';

// eslint-disable-next-line max-len
/* eslint no-param-reassign: ["error",  { "props": true, "ignorePropertyModificationsForRegex": ["^instance"] } ] */

export default function makeDeserializerWith<
  Record,
  Data,
  Deserialized extends DeserializedData,
  Extract extends DeserializerExtract<Record>,
>(config: DeserializerConfig<Record, Data, Deserialized, Extract>) {
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
    const guessedModel = await guessContextModel({
      model: (record.parent?.instance.$model ?? consumeModel(context, null)) as Model,
      relation: record.parent?.def ?? consumeRelation(context, null),
      registry,
      ensureType: identifier.type,
    });

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
  };

  const findInstance = async (
    identifier: DeserializerModelIdentifier,
    context: {},
  ) => {
    const cache = await consumeCache(context, null);
    if (cache && !isNil(identifier.id)) {
      return cache.find(identifier.model.$type, identifier.id);
    }

    const instance = consumeInstance(context, null);
    if (
      instance
      && identifier.id === instance.id
      && identifier.model.$type === instance.$model.$type
    ) {
      return instance;
    }

    return null;
  };

  const findOrMakeInstance = async (
    identifier: DeserializerModelIdentifier,
    context: {},
    // eslint-disable-next-line new-cap
  ) => (await findInstance(identifier, context) ?? new identifier.model() as ModelInstance);

  const shouldDeserialize = async (context: DeserializerContext<Record, Data, Deserialized>) => (
    shouldSync(context.def, ['pull'])
    && context.value !== undefined
    && await (config.shouldDeserialize ?? (() => true))(context)
  );

  const deserializeKey = async (context: DeserializerContext<Record, Data, Deserialized>) => (
    config.deserializeKey
      ? config.deserializeKey(context)
      : normalizeKey(context.instance.$model, context.def.key)
  );

  const deserializeAttributeValue = async (
    context: DeserializerContext<Record, Data, Deserialized, ModelAttribute>,
  ) => (
    config.deserializeAttribute
      ? config.deserializeAttribute(context)
      : (context.def.transformer?.deserialize ?? ((v) => v))(context.value)
  );

  const deserializeRelated = async (
    context: DeserializerContext<Record, Data, Deserialized, ModelRelation>,
    related: DeserializerRecord<Record, Data, Deserialized>,
    instancesMap: DeserializerInstancesMap,
  ) => (
    config.deserializeRelated
      ? config.deserializeRelated(context, related, instancesMap)
      : context.deserializer.deserializeRecord(related, context.context, instancesMap)
  );

  const deserializeRelationValue = async (
    context: DeserializerContext<Record, Data, Deserialized, ModelRelation>,
    instancesMap: DeserializerInstancesMap,
  ) => mapArrayable(context.value, (related) => deserializeRelated(
    context,
    related as DeserializerRecord<Record, Data, Deserialized>,
    instancesMap,
  ));

  let deserializer: Deserializer<Record, Data, Deserialized>;

  const makeInstancesMapIdentifier = (identifier: DeserializerModelIdentifier) => (
    identifier.id ?? identifier.lid ?? NON_IDENTIFIED_LOCAL_ID
  );

  const makeInstancesMap = () => makeIdentifiersMap() as DeserializerInstancesMap;

  const makeDeserializerContext = <Def extends ModelAttribute | ModelRelation>(
    instance: ModelInstance,
    def: Def,
    context: {},
  ) => ({ instance, def, key: def.key, value: instance[def.key], context, deserializer });

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

    await Promise.all([
      ...mapAttributes(instance, async (def) => {
        const initialDeserializerContext = makeDeserializerContext(instance, def, context);
        const deserializerContext = {
          ...initialDeserializerContext,
          value: await record.pullAttribute(initialDeserializerContext),
        };
        if (await shouldDeserialize(deserializerContext)) {
          const key = await deserializeKey(deserializerContext);

          forceFill(instance, {
            [key]: await deserializeAttributeValue(deserializerContext),
          });
        }
      }),
      ...mapRelations(instance, async (def) => {
        const initialDeserializerContext = makeDeserializerContext(instance, def, context);
        const deserializerContext = {
          ...initialDeserializerContext,
          value: await record.pullRelation(initialDeserializerContext),
        };
        if (await shouldDeserialize(deserializerContext)) {
          const key = await deserializeKey(deserializerContext);

          forceFill(instance, {
            [key]: await deserializeRelationValue(deserializerContext, instancesMap),
          });

          instance.$loaded[def.key] = true;
        }
      }),
    ]);

    const action = consumeAction(context, null);
    instance.$exists = action !== 'destroy';
    instance.$raw = record.raw;

    markSynced(instance);
    await runHooks(instance.$model, 'retrieved', instance);

    const cache = await consumeCache(context, null);
    if (cache && !isNil(instance.id)) {
      await cache.put(instance.$model.$type, instance.id, instance);
    }

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

    return (
      config.createData ? config.createData(instances, extract, context) : { instances }
    ) as Deserialized;
  };

  deserializer = {
    deserialize,
    deserializeRecord,
  };

  return deserializer;
}
