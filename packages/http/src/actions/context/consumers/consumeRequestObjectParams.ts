import { FosciaError } from '@foscia/core';
import consumeRequestConfig from '@foscia/http/actions/context/consumers/consumeRequestConfig';
import { Dictionary, tap } from '@foscia/shared';

/**
 * Consume object params. Will throw an exception if string params are configured.
 *
 * @param context
 */
export default (context: {}) => tap(consumeRequestConfig(context, null)?.params, (params) => {
  if (typeof params === 'string') {
    throw new FosciaError('Object and string URL params cannot be merged in action context.');
  }
}) as Dictionary<any> | undefined;
