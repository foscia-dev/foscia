/**
 * Remove duplicates from array.
 *
 * @param values
 *
 * @internal
 */
export default <T>(values: T[]) => [...new Set(values)];
