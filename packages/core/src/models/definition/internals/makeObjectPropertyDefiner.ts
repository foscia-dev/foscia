/**
 * Make a define function which support strict typing for an object.
 *
 * @param object
 *
 * @internal
 */
export default function makeObjectPropertyDefiner<O extends {}>(object: {}) {
  return <K extends keyof O>(
    key: K,
    value: O[K],
    options?: Pick<PropertyDescriptor, 'writable' | 'configurable'>,
  ) => Object.defineProperty(object, key, {
    writable: false,
    configurable: false,
    ...options,
    value,
  });
}
