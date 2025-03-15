import { Action, FosciaError } from '@foscia/core';
import consumeRequestConfig from '@foscia/http/actions/context/consumers/consumeRequestConfig';

/**
 * Consume object params. Will throw an exception if string params are configured.
 *
 * @param action
 *
 * @internal
 */
export default async (action: Action) => {
  const params = (await consumeRequestConfig(action, null))?.params;
  if (typeof params !== 'string') {
    return params;
  }

  throw new FosciaError('Object and string URL params cannot be merged in action context.');
};
