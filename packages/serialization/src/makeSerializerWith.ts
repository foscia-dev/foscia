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
  Serializer,
  SerializerConfig,
  SerializerContext,
  SerializerParents,
} from '@foscia/serialization/types';
import { Arrayable, Awaitable, mapArrayable } from '@foscia/shared';

export default function makeSerializerWith<Record, Related, Data>(
  config: SerializerConfig<Record, Related, Data>,
) {
  const shouldSerialize = (context: SerializerContext<Record, Related, Data>) => (
    config.shouldSerialize
      ? config.shouldSerialize(context)
      : shouldSync(context.def, ['push'])
      && context.value !== undefined
      && changed(context.instance, context.def.key)
  );

  const serializeKey = async (context: SerializerContext<Record, Related, Data>) => (
    config.serializeKey
      ? config.serializeKey(context)
      : normalizeKey(context.instance.$model, context.def.key)
  );

  const serializeAttributeValue = async (
    context: SerializerContext<Record, Related, Data, ModelAttribute>,
  ) => (
    config.serializeAttribute
      ? config.serializeAttribute(context)
      : (context.def.transformer?.serialize ?? ((v) => v))(context.value)
  );

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

  const serializeRelation = async (
    context: SerializerContext<Record, Related, Data, ModelRelation>,
    related: ModelInstance,
    parents: SerializerParents,
  ) => (
    config.serializeRelated
      ? config.serializeRelated(context, related, parents)
      : related.id
  );

  const serializeRelated = async (
    context: SerializerContext<Record, Related, Data, ModelRelation>,
    related: ModelInstance,
    parents: SerializerParents,
  ) => (
    config.serializeRelated
      ? config.serializeRelated(context, related, parents)
      : related.id
  );

  let serializer: Serializer<Record, Related, Data>;

  const makeSerializerContext = <Def extends ModelAttribute | ModelRelation>(
    instance: ModelInstance,
    def: Def,
    context: {},
  ) => ({ instance, def, key: def.key, value: instance[def.key], context, serializer });

  const serializeInstance = async (
    instance: ModelInstance,
    context: {},
    parents?: SerializerParents,
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
        const isCircular = parents && parents.some((parent) => (
          parent.instance === instance && parent.def === def
        ));
        if (isCircular) {
          throw new SerializerCircularRelationError(`Circular relation detected on \`${instance.$model.$type}.${def.key}\``);
        }

        const serializerContext = makeSerializerContext(instance, def, context);
        if (await shouldSerialize(serializerContext)) {
          const key = await serializeKey(serializerContext);
          try {
            const value = await serializeRelationWith(serializerContext, serializeRelation, [
              ...(parents ?? []),
              { instance, def },
            ]);

            await record.put({ ...serializerContext, key, value });
          } catch (error) {
            if (!(error instanceof SerializerCircularRelationError)) {
              throw error;
            }
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
    serializeRelation: async (instance: ModelInstance, def: ModelRelation, context: {}) => {
      const serializerContext = makeSerializerContext(instance, def, context);

      return serializeRelationWith(serializerContext, serializeRelated, []);
    },
    serializeInstance,
    serialize,
  };

  return serializer;
}
