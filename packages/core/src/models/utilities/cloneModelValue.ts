/**
 * Clone a model value.
 * Will shallow copy arrays.
 *
 * @param value
 *
 * @category Utilities
 * @since 0.13.0
 */
export default function cloneModelValue<T>(value: T) {
  return Array.isArray(value) ? ([...value] as T) : value;
}
