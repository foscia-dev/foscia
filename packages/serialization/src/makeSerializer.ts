import {
  isSameSnapshot,
  mapAttributes,
  mapRelations,
  ModelAttribute,
  ModelRelation,
  ModelSnapshot,
  normalizeKey,
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
import { Arrayable, Awaitable, mapArrayable, using } from '@foscia/shared';

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
  const shouldSerialize = config.shouldSerialize
    ?? ((context) => (
      shouldSync(context.def, 'push')
      && context.value !== undefined
      && (
        !context.snapshot.$original
        || !isSameSnapshot(context.snapshot, context.snapshot.$original, context.def.key)
      )
    ));

  const serializeKey = config.serializeKey
    ?? ((context) => normalizeKey(context.snapshot.$instance.$model, context.def.key));

  const serializeAttributeValue = config.serializeAttribute
    ?? ((context) => (context.def.transformer?.serialize ?? ((v) => v))(context.value));

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
      parent.model === context.snapshot.$instance.$model && parent.def === context.def
    )));

  const circularRelationBehavior = config.circularRelationBehavior
    ?? (() => 'skip');

  let serializer: RecordSerializer<Record, Related, Data>;

  const makeSerializerContext = <Def extends ModelAttribute | ModelRelation>(
    snapshot: ModelSnapshot,
    def: Def,
    context: {},
  ) => ({ snapshot, def, key: def.key, value: snapshot.$values[def.key], context, serializer });

  const serializeToRecords = async (
    snapshots: ModelSnapshot[] | ModelSnapshot | null,
    context: {},
    parents: SerializerParents = [],
  ) => mapArrayable(snapshots, async (snapshot) => {
    const record = await config.createRecord(snapshot, context);

    await Promise.all(Object.values({
      ...mapAttributes(snapshot.$instance.$model, async (def) => {
        const serializerContext = makeSerializerContext(snapshot, def, context);
        if (await shouldSerialize(serializerContext)) {
          const key = await serializeKey(serializerContext);
          const value = await serializeAttributeValue(serializerContext);

          await record.put({ ...serializerContext, key, value });
        }
      }),
      ...mapRelations(snapshot.$instance.$model, async (def) => {
        const serializerContext = makeSerializerContext(snapshot, def, context);
        const isCircular = await isCircularRelation(serializerContext, parents);
        if (isCircular) {
          const circularBehavior = await circularRelationBehavior(serializerContext, parents);
          if (circularBehavior === 'keep') {
            return;
          }

          throw new SerializerCircularRelationError(snapshot, def, circularBehavior);
        }

        if (await shouldSerialize(serializerContext)) {
          const key = await serializeKey(serializerContext);
          try {
            const value = await serializeRelationWith(serializerContext, serializeRelation, [
              ...parents,
              { model: snapshot.$instance.$model, def },
            ]);

            await record.put({ ...serializerContext, key, value });
          } catch (error) {
            if (error instanceof SerializerCircularRelationError) {
              if (error.behavior === 'skip') {
                return;
              }
            }

            throw error;
          }
        }
      }),
    }));

    return record.retrieve();
  });

  serializer = {
    serializeToRelatedRecords: async (
      parent: ModelSnapshot,
      def: ModelRelation,
      value: ModelSnapshot[] | ModelSnapshot | null,
      context: {},
    ) => using(
      makeSerializerContext(parent, def, context),
      (serializerContext) => serializeRelationWith(
        { ...serializerContext, value },
        serializeRelated,
        [{ model: parent.$instance.$model, def }],
      ),
    ),
    serializeToRecords,
    serializeToData: async (
      records: Arrayable<Record> | null,
      context: {},
    ) => (config.createData ? config.createData(records, context) : records) as Data,
  } as RecordSerializer<Record, Related, Data>;

  return { serializer };
};
