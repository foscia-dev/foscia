import { isSameSnapshot } from '@foscia/core';
import { SerializerContext } from '@foscia/serialization/types';

/**
 * Check if given property should be serialized.
 *
 * @param context
 *
 * @internal
 */
export default async <Record, Related, Data>(
  context: SerializerContext<Record, Related, Data>,
) => context.value !== undefined && (
  !context.snapshot.$original
  || !isSameSnapshot(context.snapshot, context.snapshot.$original, context.prop.key)
);
