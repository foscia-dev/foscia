import {
  Action,
  aliasPropKey,
  isRelation,
  ModelProp,
  ModelRelation,
  ModelSnapshot,
  shouldSync,
} from '@foscia/core';
import SerializerCircularRelationError
  from '@foscia/serialization/errors/serializerCircularRelationError';
import {
  RecordSerializer,
  RecordSerializerConfig,
  SerializerContext,
  SerializerParents,
} from '@foscia/serialization/types';
import defaultShouldSerialize from '@foscia/serialization/utilities/shouldSerialize';
import { Arrayable, Awaitable, mapArrayable } from '@foscia/shared';

/**
 * Make a {@link RecordSerializer | `RecordSerializer`} using the given config.
 *
 * @param config
 *
 * @category Factories
 */
export default <Record, Related, Data>(
  config: RecordSerializerConfig<Record, Related, Data>,
) => {
  let serializer: RecordSerializer<Record, Related, Data>;

  const shouldSerialize = async (context: SerializerContext<Record, Related, Data>) => (
    shouldSync(context.prop, 'push')
    && await (config.shouldSerialize ?? defaultShouldSerialize)(context)
  );

  const serializeKey = config.serializeKey
    ?? ((context) => aliasPropKey(context.prop));

  const serializeAttributeValue = config.serializeAttribute
    ?? ((context) => (context.prop.transformer?.serialize ?? ((v) => v))(context.value));

  const serializeRelation = config.serializeRelation
    ?? ((_, related) => related.$values.id);

  const serializeRelated = config.serializeRelated
    ?? ((_, related) => related.$values.id);

  const serializeRelationWith = async <T>(
    context: SerializerContext<Record, Related, Data, ModelRelation>,
    serialize: (
      context: SerializerContext<Record, Related, Data, ModelRelation>,
      snapshot: ModelSnapshot,
      parents: SerializerParents,
    ) => Awaitable<T>,
    parents: SerializerParents,
  ) => mapArrayable(context.value, (related) => serialize(
    context,
    related as ModelSnapshot,
    parents,
  ));

  const isCircularRelation = config.isCircularRelation
    ?? ((context, parents) => parents.some((parent) => (
      parent.model === context.snapshot.$instance.$model && parent.prop === context.prop
    )));

  const circularRelationBehavior = config.circularRelationBehavior
    ?? (() => 'skip');

  const makeSerializerContext = <Prop extends ModelProp | ModelRelation>(
    snapshot: ModelSnapshot,
    prop: Prop,
    action: Action,
  ) => ({ snapshot, prop, key: prop.key, value: snapshot.$values[prop.key], action, serializer });

  const serializeToRecords = async (
    snapshots: ModelSnapshot[] | ModelSnapshot | null,
    action: Action,
    parents: SerializerParents = [],
  ) => mapArrayable(snapshots, async (snapshot) => {
    const record = await config.createRecord(snapshot, action);

    await Promise.all(Object.values(snapshot.$instance.$model.$schema).map(async (prop) => {
      const isRelationProp = isRelation(prop);
      const serializerContext = makeSerializerContext(snapshot, prop, action);

      if (isRelationProp && await isCircularRelation(
        serializerContext as SerializerContext<Record, Related, Data, ModelRelation>,
        parents,
      )) {
        const circularBehavior = await circularRelationBehavior(
          serializerContext as SerializerContext<Record, Related, Data, ModelRelation>,
          parents,
        );
        if (circularBehavior === 'keep') {
          return;
        }

        throw new SerializerCircularRelationError(snapshot, prop, circularBehavior);
      }

      if (await shouldSerialize(serializerContext)) {
        const key = await serializeKey(serializerContext);

        let value: unknown;
        if (isRelationProp) {
          try {
            value = await serializeRelationWith(
              serializerContext as SerializerContext<Record, Related, Data, ModelRelation>,
              serializeRelation,
              [...parents, { model: snapshot.$instance.$model, prop: prop as ModelRelation }],
            );

            await record.put({ ...serializerContext, key, value });
          } catch (error) {
            if (error instanceof SerializerCircularRelationError) {
              if (error.behavior === 'skip') {
                return;
              }
            }

            throw error;
          }
        } else {
          value = await serializeAttributeValue(serializerContext);
        }

        await record.put({ ...serializerContext, key, value });
      }
    }));

    return record.retrieve();
  });

  serializer = {
    serializeToRelatedRecords: async (
      parent: ModelSnapshot,
      prop: ModelRelation,
      value: ModelSnapshot[] | ModelSnapshot | null,
      action: Action,
    ) => {
      const serializerContext = makeSerializerContext(parent, prop, action);

      return serializeRelationWith(
        { ...serializerContext, value },
        serializeRelated,
        [{ model: parent.$instance.$model, prop }],
      );
    },
    serializeToRecords,
    serializeToData: async (
      records: Arrayable<Record> | null,
      action: Action,
    ) => (config.createData ? config.createData(records, action) : records) as Data,
  } as RecordSerializer<Record, Related, Data>;

  return { serializer };
};
