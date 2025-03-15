/**
 * Multidimensional map function typing.
 *
 * @internal
 */
export type MultimapFunction = {
  readonly _keys: unknown;
  readonly _value: unknown;
  readonly function: (...args: any[]) => any;
};

/**
 * Make a multidimensional map function.
 *
 * @param fnc
 *
 * @internal
 */
const makeMultimapFunction = <O extends MultimapFunction>(
  fnc: (map: Map<any, any>, key: any, ...args: any[]) => any,
): {
  <K1, V>(
    map: Map<K1, V>,
    keys: readonly [K1],
    ...args: Parameters<(O & { _keys: [K1]; _value: V })['function']>
  ): ReturnType<(O & { _keys: [K1]; _value: V })['function']>;
  <K1, K2, V>(
    map: Map<K1, Map<K2, V>>,
    keys: readonly [K1, K2],
    ...args: Parameters<(O & { _keys: [K1, K2]; _value: V })['function']>
  ): ReturnType<(O & { _keys: [K1, K2]; _value: V })['function']>;
  <K1, K2, K3, V>(
    map: Map<K1, Map<K2, Map<K3, V>>>,
    keys: readonly [K1, K2, K3],
    ...args: Parameters<(O & { _keys: [K1, K2, K3]; _value: V })['function']>
  ): ReturnType<(O & { _keys: [K1, K2, K3]; _value: V })['function']>;
} => (
  map: Map<any, any>,
  keys: readonly any[],
  ...args: any[]
) => {
  if (keys.length < 2) {
    return (fnc as any)(map, keys[0], ...args);
  }

  const [key, ...otherKeys] = keys;
  if (!map.has(key)) {
    map.set(key, new Map());
  }

  return makeMultimapFunction(fnc)(map.get(key), otherKeys as [any], ...args);
};

export default makeMultimapFunction;
