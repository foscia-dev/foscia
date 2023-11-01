import { Action, ActionParsedExtension, makeEnhancersExtension } from '@foscia/core';
import consumeRequestObjectParams from '@foscia/http/actions/context/consumers/consumeRequestObjectParams';
import configureRequest from '@foscia/http/actions/context/enhancers/configureRequest';
import { Dictionary } from '@foscia/shared';

/**
 * Set the given query param on the request.
 * The new params will be merged with the previous ones.
 *
 * @param key
 * @param value
 *
 * @category Enhancers
 */
export default function param(key: string | Dictionary, value?: unknown) {
  return async <C extends {}>(action: Action<C>) => action.use(
    configureRequest({
      params: {
        ...consumeRequestObjectParams(await action.useContext()),
        ...(typeof key === 'string' ? { [key]: value } : key),
      },
    }),
  );
}

type ParamEnhancerExtension = ActionParsedExtension<{
  param<C extends {}, E extends {}>(
    this: Action<C, E>,
    key: string | Dictionary,
    value?: unknown,
  ): Action<C, E>;
}>;

param.extension = makeEnhancersExtension({ param }) as ParamEnhancerExtension;
