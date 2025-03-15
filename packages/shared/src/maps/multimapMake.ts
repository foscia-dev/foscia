import multimapSet from '@foscia/shared/maps/multimapSet';
import { Multimap } from '@foscia/shared/types';

/**
 * Make a multidimensional map from a tuples array.
 *
 * @internal
 */
export default ((values: [any, any][]) => {
  const map = new Map();

  values.forEach(([...keysAndValue]) => {
    const value = keysAndValue.pop();
    multimapSet(map, keysAndValue, value);
  });

  return map;
}) as {
  <K1, V>(values: readonly [K1, V][]): Multimap<[K1], V>;
  <K1, K2, V>(values: readonly [K1, K2, V][]): Multimap<[K1, K2], V>;
  <K1, K2, K3, V>(values: readonly [K1, K2, K3, V][]): Multimap<[K1, K2, K3], V>;
};
