import { Action, appendExtension, WithParsedExtension } from '@foscia/core';
import consumeRequestObjectParams
  from '@foscia/http/actions/context/consumers/consumeRequestObjectParams';
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
const param = (
  key: string | Dictionary,
  value?: unknown,
) => async <C extends {}>(action: Action<C>) => action.use(
  configureRequest({
    params: {
      ...consumeRequestObjectParams(await action.useContext()),
      ...(typeof key === 'string' ? { [key]: value } : key),
    },
  }),
);

export default /* @__PURE__ */ appendExtension(
  'param',
  param,
  'use',
) as WithParsedExtension<typeof param, {
  param<C extends {}, E extends {}>(
    this: Action<C, E>,
    key: string | Dictionary,
    value?: unknown,
  ): Action<C, E>;
}>;
