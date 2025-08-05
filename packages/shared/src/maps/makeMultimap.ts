import trustedEntries from '@foscia/shared/objects/trustedEntries';
import { Dictionary, Multimap } from '@foscia/shared/types';

export default function makeMultimap<K extends Dictionary<unknown>, V>(
  entries?: [K, V][],
): Multimap<K, V> {
  type InternalMultimap = Map<K[keyof K] | undefined, V | InternalMultimap>;

  const multimapCall = <F extends keyof Multimap<K, V>>(
    fnc: F,
    map: InternalMultimap,
    keys: (K[keyof K] | undefined)[],
    args: any[],
  ): ReturnType<InternalMultimap[F]> => {
    if (keys.length === 1) {
      return (map[fnc] as any)(keys[0], ...args);
    }

    const [key, ...rest] = keys;

    if (!map.has(key)) {
      map.set(key, new Map());
    }

    return multimapCall(fnc, map.get(key) as InternalMultimap, rest, args);
  };

  const multimapMapKeys = (keys: K): K[keyof K][] => {
    const filteredKeys = trustedEntries(keys).filter(([, value]) => value !== undefined);

    if (!filteredKeys.length) {
      throw new Error('Multimap cannot be used without at least one key.');
    }

    return filteredKeys
      .sort(([key1], [key2]) => (String(key1) > String(key2) ? -1 : 1))
      .map(([, value]) => value);
  };

  const multimapRecordKeys = (keys: K) => [...multimapMapKeys(keys), undefined];

  const map: InternalMultimap = new Map();

  const set = (keys: K, value: V) => multimapCall('set', map, multimapRecordKeys(keys), [value]);

  entries?.forEach(([keys, value]) => set(keys, value));

  return {
    set,
    has: (keys) => multimapCall('has', map, multimapRecordKeys(keys), []),
    get: (keys) => multimapCall('get', map, multimapRecordKeys(keys), []) as V | undefined,
    delete: (keys) => multimapCall('delete', map, multimapRecordKeys(keys), []),
    clear: (keys) => multimapCall('clear', map, multimapMapKeys(keys), []),
    values: () => {
      const extractValues = (
        current: InternalMultimap,
      ): V[] => current.values().reduce((values: V[], value) => {
        values.push(...(value instanceof Map ? extractValues(value) : [value]));

        return values;
      }, []);

      return extractValues(map);
    },
  };
}
