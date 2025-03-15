import { Model } from '@foscia/core/model/types';
import {
  ParsedIncludeMap,
  ParsedRawInclude,
  RawInclude,
  RawIncludeOptions,
} from '@foscia/core/relations/types';

/**
 * Convert a raw include into a configured raw include, except if it is already
 * a parsed include map.
 *
 * @param include
 * @param options
 *
 * @category Utilities
 * @internal
 */
export default <M = Model>(
  include: RawInclude<M>,
  options: RawIncludeOptions = {},
): ParsedIncludeMap | ParsedRawInclude => (
  include instanceof Map ? include : { include, options } as ParsedRawInclude
);
