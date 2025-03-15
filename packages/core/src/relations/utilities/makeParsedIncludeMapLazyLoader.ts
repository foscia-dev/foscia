import resolveModelAction from '@foscia/core/connections/resolveModelAction';
import { ModelInstance } from '@foscia/core/model/types';
import { ParsedRawInclude, StandardizedLazyLoader } from '@foscia/core/relations/types';
import withParsedIncludeMap from '@foscia/core/relations/utilities/withParsedIncludeMap';
import { uniqueValues } from '@foscia/shared';

/**
 * Convert a standardized eager loader to a classic eager loader supporting
 * raw includes.
 *
 * @param lazyLoader
 *
 * @category Factories
 * @internal
 */
export default (
  lazyLoader: StandardizedLazyLoader['load'],
) => async (
  instances: ModelInstance[],
  relations: ParsedRawInclude[],
) => {
  const models = uniqueValues(instances.map((i) => i.$model));

  await withParsedIncludeMap(
    resolveModelAction(models[0])(),
    models,
    relations,
    (include) => lazyLoader(instances, include),
  );
};
