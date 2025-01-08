import {
  changed,
  mapAttributes,
  mapRelations,
  ModelAttribute,
  ModelInstance,
  ModelRelation,
  normalizeKey,
  shouldSync,
} from '@foscia/core';
import SerializerCircularRelationError
  from '@foscia/serialization/errors/serializerCircularRelationError';
import {
  RecordSerializer,
  SerializerConfig,
  SerializerContext,
  SerializerParents,
} from '@foscia/serialization/types';
import { Arrayable, Awaitable, mapArrayable } from '@foscia/shared';

/**
 * Make a {@link RecordSerializer | `RecordSerializer`} using the given config.
 *
 * @param config
 *
 * @category Factories
 */
export default <Record, Related, Data>(
  config: SerializerConfig<Record, Related, Data>,
) => {
  const shouldSerialize = config.shouldSerialize
    ?? ((context) => (
      shouldSync(context.def, ['push'])
      && context.value !== undefined
      && changed(context.instance, context.def.key)
    ));

  const serializeKey = config.serializeKey
    ?? ((context) => normalizeKey(context.instance.$model, context.def.key));

  const serializeAttributeValue = config.serializeAttribute
    ?? ((context) => (context.def.transformer?.serialize ?? ((v) => v))(context.value));

  const serializeRelation = config.serializeRelation
    ?? ((_, related) => related.id);

  const serializeRelated = config.serializeRelated
    ?? ((_, related) => related.id);

  const serializeRelationWith = async <T>(
    context: SerializerContext<Record, Related, Data, ModelRelation>,
    serialize: (
      context: SerializerContext<Record, Related, Data, ModelRelation>,
      related: ModelInstance,
      parents: SerializerParents,
    ) => Awaitable<T>,
    parents: SerializerParents,
  ) => mapArrayable(context.value, (related) => serialize(
    context,
    related as ModelInstance,
    parents,
  ));

  const isCircularRelation = config.isCircularRelation
    ?? ((context, parents) => parents.some((parent) => (
      parent.instance.$model === context.instance.$model && parent.def === context.def
    )));

  const circularRelationBehavior = config.circularRelationBehavior
    ?? (() => 'skip');

  let serializer: RecordSerializer<Record, Related, Data>;

  const makeSerializerContext = <Def extends ModelAttribute | ModelRelation>(
    instance: ModelInstance,
    def: Def,
    context: {},
  ) => ({ instance, def, key: def.key, value: instance[def.key], context, serializer });

  const serializeInstance = async (
    instance: ModelInstance,
    context: {},
    parents: SerializerParents = [],
  ) => {
    const record = await config.createRecord(instance, context);

    await Promise.all([
      ...mapAttributes(instance, async (def) => {
        const serializerContext = makeSerializerContext(instance, def, context);
        if (await shouldSerialize(serializerContext)) {
          const key = await serializeKey(serializerContext);
          const value = await serializeAttributeValue(serializerContext);

          await record.put({ ...serializerContext, key, value });
        }
      }),
      ...mapRelations(instance, async (def) => {
        const serializerContext = makeSerializerContext(instance, def, context);
        const isCircular = await isCircularRelation(serializerContext, parents);
        if (isCircular) {
          const circularBehavior = await circularRelationBehavior(serializerContext, parents);
          if (circularBehavior === 'keep') {
            return;
          }

          throw new SerializerCircularRelationError(instance, def, circularBehavior);
        }

        if (await shouldSerialize(serializerContext)) {
          const key = await serializeKey(serializerContext);
          try {
            const value = await serializeRelationWith(serializerContext, serializeRelation, [
              ...parents,
              { instance, def },
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
    ]);

    return record.retrieve();
  };

  const serialize = async (
    records: Arrayable<Record> | null,
    context: {},
  ) => (config.createData ? config.createData(records, context) : records) as Data;

  serializer = {
    serializeRelation: async (
      instance: ModelInstance,
      def: ModelRelation,
      value: Arrayable<ModelInstance> | null,
      context: {},
    ) => {
      const serializerContext = makeSerializerContext(instance, def, context);

      return serializeRelationWith(
        { ...serializerContext, value },
        serializeRelated,
        [{ instance, def }],
      );
    },
    serializeInstance,
    serialize,
  };

  return { serializer };
};
