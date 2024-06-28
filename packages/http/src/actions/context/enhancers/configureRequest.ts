import { Action, appendExtension, context, WithParsedExtension } from '@foscia/core';
import consumeRequestConfig from '@foscia/http/actions/context/consumers/consumeRequestConfig';
import { HttpRequestConfig } from '@foscia/http/types';

/**
 * Configure an HTTP request used by the HttpAdapter (see {@link makeHttpAdapterWith}).
 * Some configuration options will be merged when possible (object query params,
 * headers, transformers, etc.).
 * This enhancer can be used to configure a full request object or preconfigure
 * some common options (e.g. headers and transformers).
 * Passing a [Fetch request object](https://developer.mozilla.org/docs/Web/API/Request)
 * as `request` option will ignore any other configuration and request
 * object will be directly passed to the adapter. Transformers will still be
 * applied, but other automatic transformation or data passing (params, body, etc.)
 * won't be applied.
 *
 * @param nextConfig
 *
 * @category Enhancers
 */
const configureRequest = (
  nextConfig: HttpRequestConfig,
) => async <C extends {}>(action: Action<C>) => {
  const prevRequestConfig = consumeRequestConfig(await action.useContext(), null);

  return action.use(context({
    httpRequestConfig: {
      ...prevRequestConfig,
      ...nextConfig,
      headers: { ...prevRequestConfig?.headers, ...nextConfig?.headers },
      params: typeof nextConfig.params === 'string' ? nextConfig.params : {
        ...(typeof prevRequestConfig?.params === 'string' ? {} : prevRequestConfig?.params),
        ...nextConfig.params,
      },
      requestTransformers: [
        ...(prevRequestConfig?.requestTransformers ?? []),
        ...(nextConfig?.requestTransformers ?? []),
      ],
      responseTransformers: [
        ...(prevRequestConfig?.responseTransformers ?? []),
        ...(nextConfig?.responseTransformers ?? []),
      ],
      errorTransformers: [
        ...(prevRequestConfig?.errorTransformers ?? []),
        ...(nextConfig?.errorTransformers ?? []),
      ],
    } as HttpRequestConfig,
  }));
};

export default /* @__PURE__ */ appendExtension(
  'configureRequest',
  configureRequest,
  'use',
) as WithParsedExtension<typeof configureRequest, {
  configureRequest<C extends {}, E extends {}>(
    this: Action<C, E>,
    nextConfig: HttpRequestConfig,
  ): Action<C & { httpRequestConfig: HttpRequestConfig; }, E>;
}>;
