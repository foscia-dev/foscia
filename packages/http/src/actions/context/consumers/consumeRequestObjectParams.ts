import { FosciaError } from '@foscia/core';
import consumeRequestConfig from '@foscia/http/actions/context/consumers/consumeRequestConfig';

/**
 * Consume object params. Will throw an exception if string params are configured.
 *
 * @param context
 */
export default (context: {}) => {
  const config = consumeRequestConfig(context, null);
  if (typeof config?.params === 'string') {
    throw new FosciaError('Object and string URL params cannot be merged in action context.');
  }

  return config?.params;
};
