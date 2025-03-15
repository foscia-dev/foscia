import {
  Action,
  ActionKind,
  consumeActionKind,
  consumeData,
  consumeEagerLoads,
  consumeId,
  consumeLoader,
  consumeModel,
  consumeRelation,
  logger,
} from '@foscia/core';
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
import {
  HttpAdapter,
  HttpAdapterConfig,
  HttpMethod,
  HttpRequestConfig,
  HttpRequestInitPickKey,
} from '@foscia/http/types';
import clearEndpoint from '@foscia/http/utilities/clearEndpoint';
import { Dictionary, isNil, optionalJoin, throughMiddlewares } from '@foscia/shared';

/**
 * Make a {@link HttpAdapter | `HttpAdapter`}.
 *
 * @param config
 *
 * @category Factories
 */
export default <Data = any>(config: HttpAdapterConfig<Data>) => {
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
    const { status } = response;

    if (status >= 500) return new HttpServerError(request, response);
    if (status === 401) return new HttpUnauthorizedError(request, response);
    if (status === 403) return new HttpForbiddenError(request, response);
    if (status === 404) return new HttpNotFoundError(request, response);
    if (status === 409) return new HttpConflictError(request, response);
    if (status === 429) return new HttpTooManyRequestsError(request, response);

    return new HttpInvalidRequestError(request, response);
  };

  const makeRequestEndpoint = async (action: Action, requestConfig: HttpRequestConfig) => {
    const model = await consumeModel(action, null);
    const id = await consumeId(action, null);
    const relation = await consumeRelation(action, null);

    const buildURL = config.buildURL ?? ((endpoint) => clearEndpoint(optionalJoin([
      endpoint.baseURL,
      endpoint.modelPath,
      endpoint.idPath,
      endpoint.relationPath,
      endpoint.additionalPath,
    ], '/')));

    const modelPathTransformer = config.modelPathTransformer ?? ((v) => v);
    const idPathTransformer = config.idPathTransformer ?? ((v) => v);
    const relationPathTransformer = config.relationPathTransformer ?? ((v) => v);

    return buildURL({
      baseURL: requestConfig.baseURL ?? model?.$config.baseURL ?? config.baseURL ?? '/',
      additionalPath: requestConfig.path,
      ...(requestConfig.modelPaths !== false ? {
        modelPath: model ? modelPathTransformer(
          model.$config.path ?? (model.$config.guessPath ?? ((t) => t))(model.$type),
        ) : undefined,
        idPath: isNil(id) ? undefined : idPathTransformer(
          String((model?.$config.guessIdPath ?? ((t) => t))(id)),
        ),
        relationPath: relation ? relationPathTransformer(
          relation.path ?? (model?.$config.guessRelationPath ?? ((r) => r.key))(relation),
        ) : undefined,
      } : {}),
    }, action);
  };

  const makeRequestMethod = async (action: Action, requestConfig: HttpRequestConfig) => (
    requestConfig.method ?? await (async () => {
      const actionKind = consumeActionKind(await action.useContext(), null);
      const actionsMethodsMap: Dictionary<HttpMethod> = {
        [ActionKind.READ]: 'GET',
        [ActionKind.CREATE]: 'POST',
        [ActionKind.UPDATE]: 'PATCH',
        [ActionKind.DESTROY]: 'DELETE',
        [ActionKind.ATTACH_RELATION]: 'POST',
        [ActionKind.UPDATE_RELATION]: 'PATCH',
        [ActionKind.DETACH_RELATION]: 'DELETE',
      };

      return actionKind && actionsMethodsMap[actionKind]
        ? actionsMethodsMap[actionKind]
        : 'GET';
    })()
  ).toUpperCase();

  const makeRequestInit = async (action: Action, requestConfig: HttpRequestConfig) => {
    const headers: Dictionary<string> = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...config.defaultHeaders,
    };

    let body = requestConfig.body ?? await consumeData(action, null) ?? undefined;
    if (body instanceof FormData || body instanceof URLSearchParams) {
      delete headers['Content-Type'];
    } else {
      const bodyAs = requestConfig.bodyAs
        ?? config.defaultBodyAs
        ?? ((b) => JSON.stringify(b));
      if (bodyAs && body !== undefined) {
        body = await bodyAs(body, headers);
      }
    }

    const appendHeaders = config.appendHeaders ?? (() => ({}));

    const init: Pick<RequestInit, HttpRequestInitPickKey> = {
      cache: requestConfig.cache,
      credentials: requestConfig.credentials,
      integrity: requestConfig.integrity,
      keepalive: requestConfig.keepalive,
      mode: requestConfig.mode,
      redirect: requestConfig.redirect,
      referrer: requestConfig.referrer,
      referrerPolicy: requestConfig.referrerPolicy,
      signal: requestConfig.signal,
      window: requestConfig.window,
    };

    return {
      body,
      headers: { ...headers, ...await appendHeaders(action), ...requestConfig.headers },
      method: await makeRequestMethod(action, requestConfig),
      ...init,
    } as RequestInit;
  };

  const makeRequestQueryFromObject = (params: Dictionary<any>) => (
    Object.keys(params).length > 0 ? (
      config.serializeParams ?? ((p: Dictionary<any>) => new URLSearchParams(p).toString())
    )(params) : undefined
  );

  const makeRequestQuery = async (
    action: Action,
    requestConfig: HttpRequestConfig,
  ) => optionalJoin([
    typeof requestConfig.params === 'object'
      ? makeRequestQueryFromObject(requestConfig.params)
      : requestConfig.params,
    makeRequestQueryFromObject(await (config.appendParams ?? (() => ({})))(action)),
  ], '&');

  const makeRequest = async (action: Action, requestConfig: HttpRequestConfig) => (
    requestConfig.request ?? new Request(
      optionalJoin([
        await makeRequestEndpoint(action, requestConfig),
        await makeRequestQuery(action, requestConfig),
      ], '?'),
      await makeRequestInit(action, requestConfig),
    )
  );

  const runRequest = (request: Request) => {
    // We must extract fetch from config like this before using to avoid errors.
    // Do not modify this function body.
    const { fetch } = config;

    return (fetch ?? globalThis.fetch)(request);
  };

  const execute = async (action: Action) => {
    const relations = await consumeEagerLoads(action, []);
    if (relations.length) {
      const loader = await consumeLoader(action, null);
      if (loader?.eagerLoad) {
        await loader.eagerLoad(action, relations);
      } else {
        logger.warn('Action missing eager loader implementation.');
      }
    }

    const requestConfig = await consumeRequestConfig(action, {} as HttpRequestConfig);

    const middlewares = [...config.middlewares ?? []];

    return makeHttpAdapterResponse(await throughMiddlewares(
      typeof requestConfig.middlewares === 'function'
        ? await requestConfig.middlewares(middlewares)
        : [...middlewares, ...(requestConfig.middlewares ?? [])],
      async (request) => {
        let response: Response;
        try {
          response = await runRequest(request);
        } catch (error) {
          throw makeRequestError(request, error);
        }

        if (response.status >= 200 && response.status < 300) {
          return response;
        }

        throw makeResponseError(request, response);
      },
    )(await makeRequest(action, requestConfig)), {
      reader: requestConfig.responseReader ?? config.defaultResponseReader ?? ((r) => r.json()),
    });
  };

  return { adapter: { execute } as HttpAdapter<Data> };
};
