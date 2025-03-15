import { LoaderConfig } from '@foscia/core/relations/loaders/types';
import makeParsedIncludeMapEagerLoader
  from '@foscia/core/relations/utilities/makeParsedIncludeMapEagerLoader';
import makeParsedIncludeMapLazyLoader
  from '@foscia/core/relations/utilities/makeParsedIncludeMapLazyLoader';
import { RelationsLoader } from '@foscia/core/types';

/**
 * Compose a simple {@link RelationsLoader | `RelationsLoader`} to be included
 * inside an action factory.
 *
 * @param config
 *
 * @category Factories
 * @since 0.13.0
 *
 * @remarks
 * This loader implementation does not support multiple connections nor
 * loading only missing relations. For those purposes, use
 * {@link makeSmartLoader | `makeSmartLoader`} instead.
 */
export default (config: LoaderConfig) => {
  const loader: RelationsLoader = {};

  if (config.eagerLoader) {
    loader.eagerLoad = makeParsedIncludeMapEagerLoader(config.eagerLoader.load);
  }

  if (config.lazyLoader) {
    loader.lazyLoad = makeParsedIncludeMapLazyLoader(config.lazyLoader.load);
  }

  return { loader };
};
