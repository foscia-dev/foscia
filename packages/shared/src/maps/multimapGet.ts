import makeMultimapFunction, { MultimapFunction } from '@foscia/shared/maps/makeMultimapFunction';

/**
 * Multidimensional map `get` function typing.
 *
 * @internal
 */
interface MultimapGet extends MultimapFunction {
  readonly function: () => this['_value'] | undefined;
}

/**
 * Multidimensional map `get` function.
 *
 * @internal
 */
export default /* @__PURE__ */ makeMultimapFunction<MultimapGet>(
  (map, key) => map.get(key),
);
