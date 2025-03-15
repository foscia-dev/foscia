import { StandardizedLazyLoader } from '@foscia/core/relations/loaders/types';

/**
 * Create a standardized lazy loader.
 *
 * @param load
 * @param options
 *
 * @category Factories
 * @internal
 */
export default (load: StandardizedLazyLoader['load'], options: Omit<StandardizedLazyLoader, 'load'> = {}) => ({
  load,
  ...options,
});
