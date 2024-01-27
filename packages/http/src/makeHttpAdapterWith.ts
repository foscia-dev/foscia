import { consumeAction, consumeData, consumeId, consumeModel, consumeRelation } from '@foscia/core';
import consumeRequestConfig from '@foscia/http/actions/context/consumers/consumeRequestConfig';
import HttpAbortedError from '@foscia/http/errors/httpAbortedError';
import HttpConflictError from '@foscia/http/errors/httpConflictError';
import HttpForbiddenError from '@foscia/http/errors/httpForbiddenError';
import HttpInterruptedError from '@foscia/http/errors/httpInterruptedError';
import HttpInvalidRequestError from '@foscia/http/errors/httpInvalidRequestError';
import HttpNotFoundError from '@foscia/http/errors/httpNotFoundError';
import HttpServerError from '@foscia/http/errors/httpServerError';
import HttpTooManyRequestsError from '@foscia/http/errors/httpTooManyRequestsError';
import HttpUnauthorizedError from '@foscia/http/errors/httpUnauthorizedError';
import makeHttpAdapterResponse from '@foscia/http/makeHttpAdapterResponse';
import { HttpAdapter, HttpAdapterConfig, HttpMethod, HttpRequestConfig } from '@foscia/http/types';
import { Dictionary, isNil, optionalJoin, sequentialTransform } from '@foscia/shared';

export default function makeHttpAdapterWith<Data = any>(config: HttpAdapterConfig<Data>) {
  const transformRequest = (
    contextConfig: HttpRequestConfig,
    request: Request,
  ) => sequentialTransform([
    ...(config.requestTransformers ?? []),
    ...(contextConfig.requestTransformers ?? []),
  ], request);

  const transformResponse = (
    contextConfig: HttpRequestConfig,
    response: Response,
  ) => sequentialTransform([
    ...(config.responseTransformers ?? []),
    ...(contextConfig.responseTransformers ?? []),
  ], response);

  const transformError = (
    contextConfig: HttpRequestConfig,
    error: unknown,
  ) => sequentialTransform([
    ...(config.errorTransformers ?? []),
    ...(contextConfig.errorTransformers ?? []),
  ], error);

  const makeRequestError = (request: Request, error: unknown) => (
    error instanceof DOMException && error.name === 'AbortError'
      ? new HttpAbortedError(error.message, request, error)
      : new HttpInterruptedError(
        error instanceof Error ? error.message : 'Unknown fetch adapter error',
        request,
        error,
      )
  );

  const makeResponseError = (request: Request, response: Response) => {
    switch (true) {
      case response.status >= 500:
        return new HttpServerError(request, response);
      case response.status === 401:
        return new HttpUnauthorizedError(request, response);
      case response.status === 403:
        return new HttpForbiddenError(request, response);
      case response.status === 404:
        return new HttpNotFoundError(request, response);
      case response.status === 409:
        return new HttpConflictError(request, response);
      case response.status === 429:
        return new HttpTooManyRequestsError(request, response);
      default:
        return new HttpInvalidRequestError(request, response);
    }
  };

  const clearRequestEndpoint = (url: string) => url.replace(/([^:]\/)\/+/g, '$1');

  const makeRequestEndpoint = (context: {}, contextConfig: HttpRequestConfig) => {
    const model = consumeModel(context, null);
    const id = consumeId(context, null);
    const relation = consumeRelation(context, null);

    const modelPaths = contextConfig?.modelPaths !== false ? [
      isNil(model)
        ? undefined
        : (model.$config.path ?? (model.$config.guessPath ?? ((t) => t))(model.$type)),
      isNil(id)
        ? undefined
        : String(id),
      isNil(relation)
        ? undefined
        : (relation.path ?? (model?.$config.guessRelationPath ?? ((r) => r.key))(relation)),
    ] : [];

    const requestURL = optionalJoin([
      contextConfig?.baseURL ?? model?.$config.baseURL ?? config.baseURL ?? '/',
      ...modelPaths,
      contextConfig?.path,
    ], '/');

    return clearRequestEndpoint(requestURL);
  };

  const makeRequestMethod = (context: {}, contextConfig: HttpRequestConfig) => (() => {
    if (contextConfig?.method) {
      return contextConfig.method;
    }

    const action = consumeAction(context, null);
    const actionsMethodsMap: Dictionary = {
      read: 'GET',
      create: 'POST',
      update: 'PATCH',
      destroy: 'DELETE',
    };
    if (action && actionsMethodsMap[action]) {
      return actionsMethodsMap[action] as HttpMethod;
    }

    return 'GET';
  })().toUpperCase();

  const makeRequestInit = async (context: {}, contextConfig: HttpRequestConfig) => {
    const headers: Dictionary<string> = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...config.defaultHeaders,
    };

    let body = contextConfig?.body ?? consumeData(context, null) ?? undefined;
    if (body instanceof FormData || body instanceof URLSearchParams) {
      delete headers['Content-Type'];
    } else {
      const bodyAs = contextConfig?.bodyAs
        ?? config.defaultBodyAs
        ?? ((b) => JSON.stringify(b));
      if (bodyAs && body !== undefined) {
        body = await bodyAs(body, headers);
      }
    }

    const appendHeaders = config.appendHeaders ?? (() => ({}));

    return {
      body,
      headers: { ...headers, ...await appendHeaders(context), ...contextConfig?.headers },
      method: makeRequestMethod(context, contextConfig),
      signal: contextConfig?.signal,
    } as RequestInit;
  };

  const makeRequestQuery = async (context: {}, contextConfig: HttpRequestConfig) => optionalJoin([
    typeof contextConfig.params === 'object'
      ? config.serializeParams(contextConfig.params)
      : contextConfig.params,
    config.serializeParams(await (config.appendParams ?? (() => ({})))(context)),
  ], '&');

  const makeRequestURL = async (context: {}, contextConfig: HttpRequestConfig) => optionalJoin([
    makeRequestEndpoint(context, contextConfig),
    await makeRequestQuery(context, contextConfig),
  ], '?');

  const makeRequest = async (context: {}, contextConfig: HttpRequestConfig) => (
    contextConfig.request ?? new Request(
      await makeRequestURL(context, contextConfig),
      await makeRequestInit(context, contextConfig),
    )
  );

  const runRequest = (request: Request) => {
    const { fetch } = config;

    return (fetch ?? globalThis.fetch)(request);
  };

  const execute = async (context: {}) => {
    const contextConfig = consumeRequestConfig(context, null) ?? {};
    const request = await transformRequest(context, await makeRequest(context, contextConfig));

    let response: Response;
    try {
      response = await runRequest(request);
    } catch (error) {
      throw await transformError(context, makeRequestError(request, error));
    }

    if (response.status >= 200 && response.status < 300) {
      return makeHttpAdapterResponse(await transformResponse(context, response), {
        reader: contextConfig?.responseReader ?? config.defaultResponseReader ?? ((r) => r.json()),
      });
    }

    throw await transformError(context, makeResponseError(request, response));
  };

  return { execute } as HttpAdapter<Data>;
}
