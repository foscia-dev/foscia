import { Action, context } from '@foscia/core';
import consumeRequestConfig from '@foscia/http/actions/context/consumers/consumeRequestConfig';
import { HttpRequestConfig } from '@foscia/http/types';

export default function configureRequest(request: HttpRequestConfig) {
  return async <C extends {}>(action: Action<C>) => action.use(context({
    httpRequestConfig: {
      ...consumeRequestConfig(await action.useContext(), null),
      ...request,
    },
  }));
}
