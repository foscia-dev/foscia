import makeMultimapFunction, { MultimapFunction } from '@foscia/shared/maps/makeMultimapFunction';

/**
 * Multidimensional map `set` function typing.
 *
 * @internal
 */
interface MultimapSet extends MultimapFunction {
  readonly function: (value: this['_value']) => void;
}

/**
 * Multidimensional map `set` function.
 *
 * @internal
 */
export default /* @__PURE__ */ makeMultimapFunction<MultimapSet>(
  (map, key, value) => map.set(key, value),
);
