import logger from '@foscia/core/logger/logger';
import { ModelIdType, ModelInstance, ModelRelationKey } from '@foscia/core/model/types';
import { Arrayable } from '@foscia/shared';

/**
 * Create an extractor to retrieve related IDs and types.
 *
 * @param pullValue
 * @param parseValue
 *
 * @category Factories
 * @since 0.8.2
 */
export default <V>(
  pullValue: <I extends ModelInstance>(
    instance: I,
    relation: ModelRelationKey<I>,
  ) => Arrayable<V> | null | undefined,
  parseValue: (value: V) => { id: ModelIdType; type?: string; },
) => <I extends ModelInstance>(
  instance: I,
  relation: ModelRelationKey<I>,
) => {
  const related = pullValue(instance, relation);
  if (related === undefined) {
    logger.warn(
      `Extracted \`${relation}\` relation's IDs for \`${instance.$model.$type}:${instance.id}\` is undefined, you should customize extraction process using \`extract\` option.`,
    );

    return undefined;
  }

  if (related === null) {
    return null;
  }

  return Array.isArray(related)
    ? related.map((value) => parseValue(value))
    : parseValue(related);
};
