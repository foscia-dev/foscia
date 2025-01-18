/**
 * Clone a model value.
 * Will shallow copy arrays.
 *
 * @param value
 *
 * @since 0.13.0
 */
export default <T>(value: T) => (
  Array.isArray(value) ? [...value] : value
) as T;
