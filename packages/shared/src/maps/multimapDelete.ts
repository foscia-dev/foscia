import makeMultimapFunction, { MultimapFunction } from '@foscia/shared/maps/makeMultimapFunction';

/**
 * Multidimensional map `delete` function typing.
 *
 * @internal
 */
interface MultimapDelete extends MultimapFunction {
  readonly function: (v?: this['_value']) => boolean;
}

/**
 * Multidimensional map `delete` function.
 *
 * @internal
 */
export default /* @__PURE__ */ makeMultimapFunction<MultimapDelete>(
  (map, key) => map.delete(key),
);
