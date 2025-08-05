import {
  Action,
  aliasProp,
  attachRelationInverse,
  consumeActionKind,
  consumeCache,
  consumeId,
  consumeInstance,
  consumeLazyEagerLoadCallback,
  consumeModel,
  consumeQueryAs,
  consumeRelation,
  DataDeserializer,
  DeserializerError,
  isSame,
  markSynced,
  Model,
  ModelInstance,
  ModelPrimaryDictionary,
  ModelPrimaryType,
  ModelProp,
  modelRegistry,
  primaryValues,
  resolveConnectionName,
  resolveContextModels,
  runAsyncHooks,
  shouldSyncProp,
} from '@foscia/core';
import isModelPrimary from '@foscia/core/models/definition/utilities/isModelPrimary';
import isModelRelation from '@foscia/core/models/definition/utilities/isModelRelation';
import strictOf from '@foscia/core/models/internals/strictOf';
import { DataDeserializerConfig } from '@foscia/serialization/types';
import { Arrayable, Dictionary, isNil, makeMultimap, Multimap, wrap } from '@foscia/shared';

/**
 * Make a {@link DataDeserializer | `DataDeserializer`} using the given config.
 *
 * @param config
 *
 * @category Factories
 */
export default function makeDataDeserializer<
  Data,
  DeserializedData = undefined,
  ExtractedData = Data,
  Record = unknown,
>(
  config: DataDeserializerConfig<Data, DeserializedData, ExtractedData, Record>,
): DataDeserializer<Data, DeserializedData> {
  type DeserializerRecordIdentifier = {
    model: Model<ModelInstance>;
    primary: ModelPrimaryDictionary;
  };

  type DeserializerInstancesMap =
    Multimap<Dictionary<Model | ModelPrimaryType | null>, Promise<ModelInstance>>;

  let deserializeRecord: <
    T,
    Instance extends ModelInstance,
  >(
    context: {
      action: Action;
      data: ExtractedData;
      record: Record;
      instance: Instance | null;
      prop: ModelProp<T, Instance> | null;
    },
    instances: DeserializerInstancesMap,
  ) => Promise<ModelInstance>;

  const deserializeValue = async <
    T,
    Instance extends ModelInstance,
  >(
    context: {
      action: Action;
      data: ExtractedData;
      record: Record;
      instance: Instance | null;
      prop: ModelProp<T, Instance>;
    },
    instances: DeserializerInstancesMap,
  ) => {
    if (shouldSyncProp(context.prop, 'pull')) {
      const key = aliasProp(context.prop) ?? (
        config.deserializeKey ? await config.deserializeKey(context) : context.prop.key
      );

      return config.deserializeValue(
        { ...context, key },
        (record) => deserializeRecord({ ...context, record }, instances),
      );
    }

    return undefined;
  };

  const makeRecordIdentifier = async <
    T,
    Instance extends ModelInstance,
  >(
    context: {
      action: Action;
      data: ExtractedData;
      record: Record;
      instance: Instance | null;
      prop: ModelProp<T, Instance> | null;
    },
    instances: DeserializerInstancesMap,
  ): Promise<DeserializerRecordIdentifier> => {
    const fullFillIdentifier = async <FoundInstance extends ModelInstance>(
      model: Model<FoundInstance>,
    ) => ({
      model,
      primary: Object.fromEntries(
        await Promise.all(
          strictOf(model).$schema.values()
            .filter((prop) => isModelPrimary(prop))
            .map(async (prop) => [
              prop.key,
              await deserializeValue({ ...context, instance: null, prop }, instances),
            ] as const),
        ),
      ),
    });

    // Try to resolve the model directly from the type when possible.
    // This will provide support for polymorphism and registry based
    // actions.
    const type = await config.deserializeType?.(context);
    if (!isNil(type)) {
      const model = modelRegistry.get(`${await resolveConnectionName(context.action)}:${type}`);
      if (model) {
        return fullFillIdentifier(model);
      }
    }

    // When no registry is configured or identifier type was not retrieved,
    // we'll try to resolve the model from the context.
    // This will also ensure guessed model type matches deserializing record.
    const models = await resolveContextModels({
      queryAs: await consumeQueryAs(context.action, null),
      ...(
        context.instance && context.prop && isModelRelation(context.prop)
          ? {
            model: context.instance.$model,
            relation: context.prop,
          }
          : {
            model: await consumeModel(context.action, null),
            relation: await consumeRelation(context.action, null),
          }
      ),
    });
    const model = type
      ? models.find((m) => m.$type === type)
      : models[0];
    if (!model) {
      throw new DeserializerError(`Could not resolve model for type \`${type}\`.`);
    }

    return fullFillIdentifier(model);
  };

  const makeModelIdentifierMapKey = (identifier: DeserializerRecordIdentifier) => ({
    $model: identifier.model, ...identifier.primary,
  });

  const findInstance = async (
    context: { action: Action; data: ExtractedData; },
    identifier: DeserializerRecordIdentifier,
  ) => {
    const cache = await consumeCache(context.action, null);
    if (cache) {
      const instance = await cache.get(identifier.model, identifier.primary);
      if (instance) {
        return instance;
      }
    }

    const instance = await consumeInstance(context.action, null);
    if (
      instance
      && instance.$model === identifier.model
      && instance.$model.$schema.values().every(
        (prop) => !isModelPrimary(prop) || prop.get(instance) === identifier.primary[prop.key],
      )
    ) {
      return instance;
    }

    return null;
  };

  const findOrMakeInstance = async (
    context: { action: Action; data: ExtractedData; },
    identifier: DeserializerRecordIdentifier,
  ) => await findInstance(context, identifier) ?? new identifier.model();

  const deserializeExists = async <Instance extends ModelInstance>(
    context: { action: Action; data: ExtractedData; record: Record; instance: Instance; },
  ) => {
    if (await consumeActionKind(context.action, null) === 'destroy') {
      if (isSame(context.instance, await consumeInstance(context.action, null))) {
        return false;
      }

      if (context.instance.$model === await consumeModel(context.action, null)) {
        const primary = primaryValues(context.instance);
        if (
          Object.keys(primary).length === 1
          && Object.values(primary)[0] === await consumeId(context.action, null)
        ) {
          return false;
        }
      }
    }

    return true;
  };

  const deserializeRecordIn = async <Instance extends ModelInstance>(
    context: { action: Action; data: ExtractedData; record: Record; instance: Instance; },
    instances: DeserializerInstancesMap,
  ) => {
    await Promise.all(strictOf(context.instance).$model.$schema.values().map(async (prop) => {
      const value = await deserializeValue({ ...context, prop }, instances);
      if (value !== undefined) {
        prop.set(context.instance, value);

        if (isModelRelation(prop)) {
          context.instance.$loaded.add(prop.key);
          attachRelationInverse(context.instance, prop, value as Arrayable<ModelInstance> | null);
        }
      }
    }));

    context.instance.$exists = await deserializeExists(context);
    context.instance.$raw = context.record;
  };

  deserializeRecord = async <
    T,
    Instance extends ModelInstance,
  >(
    context: {
      action: Action;
      data: ExtractedData;
      record: Record;
      instance: Instance | null;
      prop: ModelProp<T, Instance> | null;
    },
    instances: DeserializerInstancesMap,
  ) => {
    const identifier = await makeRecordIdentifier(context, instances);

    const mapKey = makeModelIdentifierMapKey(identifier);

    let instancePromise = instances.get(mapKey);
    if (instancePromise) {
      return instancePromise;
    }

    instances.set(mapKey, instancePromise = findOrMakeInstance(context, identifier));

    await deserializeRecordIn(
      { ...context, instance: await instancePromise },
      instances,
    );

    return instancePromise;
  };

  const prepareInstancesMap = async (
    context: { action: Action; data: ExtractedData; },
    records: Record[] | Record | null,
  ) => {
    const instances: DeserializerInstancesMap = makeMultimap();

    // Handle a singular creation context to map a non-identified instance
    // to the single returned resource if available.
    const actionKind = await consumeActionKind(context.action, null);
    const instance = await consumeInstance(context.action, null);
    if (
      actionKind === 'create'
      && instance
      && records
      && !Array.isArray(records)
    ) {
      const recordContext = { ...context, record: records, instance: null, prop: null };
      const identifier = await makeRecordIdentifier(recordContext, instances);

      instances.set(makeModelIdentifierMapKey(identifier), Promise.resolve(instance));

      await deserializeRecordIn({ ...recordContext, instance }, instances);
    }

    return instances;
  };

  const releaseInstancesMap = (
    action: Action,
    instancesMap: DeserializerInstancesMap,
  ) => Promise.all(instancesMap.values().map(async (instancePromise) => {
    const instance = await instancePromise;

    markSynced(instance);
    await runAsyncHooks(instance.$model, 'retrieved', instance);

    const cache = await consumeCache(action, null);
    if (cache) {
      await cache.set(instance);
    }
  }));

  const deserialize = async (
    data: Data,
    action: Action,
  ) => {
    const extractData = config.extractData! ?? ((d) => d);
    const extractedData = await extractData({ action, data });
    const records = await config.extractRecords({ action, data }) ?? null;
    const context = { action, data: extractedData };

    const instances = await prepareInstancesMap(context, records);

    const directInstances = await Promise.all(wrap(records).map(
      (record) => deserializeRecord({ ...context, record, instance: null, prop: null }, instances),
    ));

    if (directInstances.length) {
      const parent = await consumeInstance(action, null);
      const relation = await consumeRelation(action, null);
      if (parent && relation) {
        attachRelationInverse(parent, relation, directInstances);
      }

      const lazyEagerLoadCallback = await consumeLazyEagerLoadCallback(action, null);
      await lazyEagerLoadCallback?.(directInstances);
    }

    await releaseInstancesMap(action, instances);

    const deserializeData = config.deserializeData! ?? (() => undefined);

    return {
      instances: directInstances,
      data: await deserializeData({ action, data: extractedData, instances: directInstances }),
    };
  };

  return {
    deserialize,
  };
}
