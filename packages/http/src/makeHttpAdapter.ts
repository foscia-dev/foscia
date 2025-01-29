import {
  ActionName,
  consumeAction,
  consumeData,
  consumeId,
  consumeModel,
  consumeRelation,
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

  const makeRequestEndpoint = (context: {}, contextConfig: HttpRequestConfig) => {
    const model = consumeModel(context, null);
    const id = consumeId(context, null);
    const relation = consumeRelation(context, null);

    const buildURL = config.buildURL ?? ((ctx) => clearEndpoint(optionalJoin([
      ctx.baseURL,
      ctx.modelPath,
      ctx.idPath,
      ctx.relationPath,
      ctx.additionalPath,
    ], '/')));

    const modelPathTransformer = config.modelPathTransformer ?? ((v) => v);
    const idPathTransformer = config.idPathTransformer ?? ((v) => v);
    const relationPathTransformer = config.relationPathTransformer ?? ((v) => v);

    return buildURL({
      baseURL: contextConfig.baseURL ?? model?.$config.baseURL ?? config.baseURL ?? '/',
      additionalPath: contextConfig.path,
      ...(contextConfig.modelPaths !== false ? {
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
    }, context);
  };

  const makeRequestMethod = (context: {}, contextConfig: HttpRequestConfig) => (
    contextConfig.method ?? (() => {
      const action = consumeAction(context, null);
      const actionsMethodsMap: Dictionary = {
        [ActionName.READ]: 'GET',
        [ActionName.CREATE]: 'POST',
        [ActionName.UPDATE]: 'PATCH',
        [ActionName.DESTROY]: 'DELETE',
        [ActionName.ATTACH_RELATION]: 'POST',
        [ActionName.UPDATE_RELATION]: 'PATCH',
        [ActionName.DETACH_RELATION]: 'DELETE',
      };

      return action && actionsMethodsMap[action]
        ? actionsMethodsMap[action] as HttpMethod
        : 'GET';
    })()
  ).toUpperCase();

  const makeRequestInit = async (context: {}, contextConfig: HttpRequestConfig) => {
    const headers: Dictionary<string> = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...config.defaultHeaders,
    };

    let body = contextConfig.body ?? consumeData(context, null) ?? undefined;
    if (body instanceof FormData || body instanceof URLSearchParams) {
      delete headers['Content-Type'];
    } else {
      const bodyAs = contextConfig.bodyAs
        ?? config.defaultBodyAs
        ?? ((b) => JSON.stringify(b));
      if (bodyAs && body !== undefined) {
        body = await bodyAs(body, headers);
      }
    }

    const appendHeaders = config.appendHeaders ?? (() => ({}));

    const init: Pick<RequestInit, HttpRequestInitPickKey> = {
      cache: contextConfig.cache,
      credentials: contextConfig.credentials,
      integrity: contextConfig.integrity,
      keepalive: contextConfig.keepalive,
      mode: contextConfig.mode,
      redirect: contextConfig.redirect,
      referrer: contextConfig.referrer,
      referrerPolicy: contextConfig.referrerPolicy,
      signal: contextConfig.signal,
      window: contextConfig.window,
    };

    return {
      body,
      headers: { ...headers, ...await appendHeaders(context), ...contextConfig.headers },
      method: makeRequestMethod(context, contextConfig),
      ...init,
    } as RequestInit;
  };

  const makeRequestQueryFromObject = (params: Dictionary<any>) => (
    Object.keys(params).length > 0 ? (
      config.serializeParams ?? ((p: Dictionary<any>) => new URLSearchParams(p).toString())
    )(params) : undefined
  );

  const makeRequestQuery = async (context: {}, contextConfig: HttpRequestConfig) => optionalJoin([
    typeof contextConfig.params === 'object'
      ? makeRequestQueryFromObject(contextConfig.params)
      : contextConfig.params,
    makeRequestQueryFromObject(await (config.appendParams ?? (() => ({})))(context)),
  ], '&');

  const makeRequest = async (context: {}, contextConfig: HttpRequestConfig) => (
    contextConfig.request ?? new Request(
      optionalJoin([
        makeRequestEndpoint(context, contextConfig),
        await makeRequestQuery(context, contextConfig),
      ], '?'),
      await makeRequestInit(context, contextConfig),
    )
  );

  const runRequest = (request: Request) => {
    // We must extract fetch from config like this before using to avoid errors.
    // Do not modify this function body.
    const { fetch } = config;

    return (fetch ?? globalThis.fetch)(request);
  };

  const execute = async (context: {}) => {
    const contextConfig = consumeRequestConfig(context, null) ?? {};
    const middlewares = [...config.middlewares ?? []];

    return makeHttpAdapterResponse(await throughMiddlewares(
      typeof contextConfig.middlewares === 'function'
        ? await contextConfig.middlewares(middlewares)
        : [...middlewares, ...(contextConfig.middlewares ?? [])],
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
    )(await makeRequest(context, contextConfig)), {
      reader: contextConfig.responseReader ?? config.defaultResponseReader ?? ((r) => r.json()),
    });
  };

  return { adapter: { execute } as HttpAdapter<Data> };
};
