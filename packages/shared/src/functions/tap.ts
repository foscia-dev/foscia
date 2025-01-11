/**
 * Call given callback and return value.
 * Since callback is not awaited, it does not support async callbacks.
 *
 * @param value
 * @param callback
 *
 * @internal
 */
export default <T, C extends (value: T) => any>(
  value: T,
  callback: ReturnType<C> extends Promise<any> ? never : C,
) => {
  callback(value);

  return value;
};
