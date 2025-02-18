import isTransformer from '@foscia/core/transformers/isTransformer';
import { ObjectTransformer } from '@foscia/core/transformers/types';

/**
 * Parse a value property factory config.
 *
 * @param config
 * @param otherConfig
 *
 * @internal
 */
export default <T, C extends {}>(
  config?: ObjectTransformer<T | null, any, any> | T | (() => T),
  otherConfig?: C,
) => (
  isTransformer(config)
    ? { transformer: config, ...otherConfig }
    : { default: config, ...otherConfig }
);
