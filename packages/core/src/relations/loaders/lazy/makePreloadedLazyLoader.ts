import consumeModel from '@foscia/core/actions/context/consumers/consumeModel';
import logger from '@foscia/core/logger/logger';
import aliasPropKey from '@foscia/core/model/props/utilities/aliasPropKey';
import { ModelInstance } from '@foscia/core/model/types';
import makeFilteredLazyLoader from '@foscia/core/relations/loaders/lazy/makeFilteredLazyLoader';
import {
  PreloadedLazyLoaderConfig,
  PreloadedReference,
} from '@foscia/core/relations/loaders/types';
import { mapArrayable, multimapGet, multimapMake } from '@foscia/shared';

/**
 * Create a {@link StandardizedLazyLoader | `StandardizedLazyLoader`} using
 * {@link makeFilteredLazyLoader | `makeFilteredLazyLoader`} to query preloaded
 * relations using filled IDs (and types if available) from raw records.
 *
 * @category Factories
 * @since 0.13.0
 */
export default <Reference extends PreloadedReference, RawReference = any>(
  config: PreloadedLazyLoaderConfig<Reference, RawReference>,
) => makeFilteredLazyLoader<Reference>({
  extract: async (instance, relation) => {
    const values: RawReference[] | RawReference | null | undefined = config.extract
      ? await config.extract(instance, relation)
      : instance.$raw[aliasPropKey(relation)];

    return mapArrayable(values, config.normalize ?? ((value: any) => (
      typeof value === 'object' ? { id: value.id, type: value.type } : { id: value }
    ) as Reference));
  },
  prepare: async (action, references) => {
    const model = await consumeModel(action);
    const modelReferences = references.filter(
      (r) => !r.type || r.type === model.$type,
    );

    return modelReferences.length
      ? config.prepare(action, modelReferences)
      : false;
  },
  remap: (references, related) => {
    const relatedMap = multimapMake(related.map((instance) => [
      instance.id, instance.$model.$type, instance,
    ]));

    return new Map(references.reduce((entries, reference) => {
      const instance = reference.type
        ? multimapGet(relatedMap, [reference.id, reference.type])
        : relatedMap.get(reference.id)?.values().next().value;

      if (instance) {
        entries.push([reference, [instance]]);
      } else {
        logger.warn('Could not found related instance for reference.', reference);
      }

      return entries;
    }, [] as [Reference, ModelInstance[]][]));
  },
});
