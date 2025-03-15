import { makeRestEagerLoader } from '@foscia/rest';

/**
 * Make a JSON:API eager relations loader to bind included relations
 * to an `include` query parameter.
 *
 * @category Factories
 * @since 0.13.0
 *
 * @remarks
 * This loader does not support eager loading with custom queries.
 */
export default () => makeRestEagerLoader({ param: 'include' });
