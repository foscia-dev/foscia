/**
 * Call given callback with given value.
 *
 * @param value
 * @param callback
 *
 * @internal
 */
export default <T, U>(value: T, callback: (value: T) => U) => callback(value);
