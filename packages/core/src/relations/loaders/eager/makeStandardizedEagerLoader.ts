import { StandardizedEagerLoader } from '@foscia/core/relations/loaders/types';

/**
 * Create a standardized eager loader.
 *
 * @param load
 * @param options
 *
 * @category Factories
 * @internal
 */
export default (load: StandardizedEagerLoader['load'], options: Omit<StandardizedEagerLoader, 'load'>) => ({
  load,
  ...options,
});
