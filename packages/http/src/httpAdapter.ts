import {
  AdapterI,
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
import {
  BodyAsTransformer,
  ErrorTransformer,
  HttpAdapterConfig,
  HttpMethod,
  HttpParamsSerializer,
  RequestTransformer,
  ResponseTransformer,
} from '@foscia/http/types';
import { applyConfig, Dictionary, isNil, optionalJoin, sequentialTransform } from '@foscia/shared';

/**
 * Adapter implementation for HTTP interaction using fetch.
 */
export default class HttpAdapter implements AdapterI<Response> {
  private baseURL: string | null = null;

  private fetch = globalThis.fetch;

  private serializeParams: HttpParamsSerializer;

  private defaultHeaders: Dictionary<string> = {};

  private defaultBodyAs: BodyAsTransformer | null = null;

  private requestTransformers: RequestTransformer[] = [];

  private responseTransformers: ResponseTransformer[] = [];

  private errorTransformers: ErrorTransformer[] = [];

  public constructor(config: HttpAdapterConfig) {
    this.serializeParams = config.serializeParams;

    this.configure(config);
  }

  public configure(config: HttpAdapterConfig, override = true) {
    applyConfig(this, config, override);
  }

  /**
   * @inheritDoc
   */
  public async execute(context: {}): Promise<Response> {
    const request = await this.transformRequest(context, await this.makeRequest(context));

    let response: Response;
    try {
      response = await this.runRequest(request);
    } catch (error) {
      throw await this.transformError(
        context,
        await this.makeRequestError(request, error),
      );
    }

    if (response.status >= 200 && response.status < 300) {
      return this.transformResponse(context, response);
    }

    throw await this.transformError(
      context,
      await this.makeResponseError(request, response),
    );
  }

  protected async makeRequest(context: {}): Promise<Request> {
    const config = consumeRequestConfig(context, null);

    return config?.request ?? new Request(
      await this.makeRequestURL(context),
      await this.makeRequestInit(context),
    );
  }

  protected async makeRequestURL(context: {}) {
    return optionalJoin([
      await this.makeRequestURLEndpoint(context),
      await this.makeRequestURLParams(context),
    ], '?');
  }

  /**
   * Create the request init object from the given context.
   * May also affect the headers and body.
   *
   * @param context
   */
  protected async makeRequestInit(context: {}) {
    const config = consumeRequestConfig(context, null);
    const method = (await this.makeRequestMethod(context)).toUpperCase();
    let headers = { ...this.defaultHeaders };
    let body = config?.body ?? consumeData(context, null) ?? undefined;

    const keepBodyFormat = body instanceof FormData || body instanceof URLSearchParams;
    if (keepBodyFormat) {
      delete headers['Content-Type'];
    }

    headers = { ...headers, ...config?.headers };

    const bodyAs = config?.bodyAs ?? this.defaultBodyAs;
    if (bodyAs && body !== undefined && !keepBodyFormat) {
      body = await bodyAs(body, headers);
    }

    return {
      method,
      headers,
      body,
      signal: config?.signal,
    } as RequestInit;
  }

  protected async makeRequestMethod(context: {}): Promise<HttpMethod> {
    const config = consumeRequestConfig(context, null);
    if (config?.method) {
      return config.method;
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
  }

  protected async makeRequestURLEndpoint(context: {}) {
    const config = consumeRequestConfig(context, null);
    const model = consumeModel(context, null);
    const id = consumeId(context, null);
    const relation = consumeRelation(context, null);

    const modelPaths = config?.modelPaths !== false ? [
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

    const requestEndpoint = optionalJoin([
      config?.baseURL ?? model?.$config.baseURL ?? this.baseURL,
      ...modelPaths,
      config?.path,
    ], '/');

    return this.clearRequestURLEndpoint(requestEndpoint);
  }

  protected clearRequestURLEndpoint(endpoint: string) {
    return endpoint.replace(/([^:]\/)\/+/g, '$1');
  }

  protected async makeRequestURLParams(context: {}) {
    const config = consumeRequestConfig(context, null);
    if (typeof config?.params === 'string') {
      return this.makeRequestURLParamsFromString(config.params);
    }

    if (config?.params) {
      return this.makeRequestURLParamsFromObject(config?.params);
    }

    return undefined;
  }

  protected makeRequestURLParamsFromString(params: string) {
    return params;
  }

  protected makeRequestURLParamsFromObject(params: Dictionary) {
    return this.serializeParams(params);
  }

  protected runRequest(request: Request) {
    // Destructure to avoid calling fetch with this context.
    const { fetch } = this;

    return fetch(request);
  }

  protected async makeRequestError(request: Request, error: unknown): Promise<unknown> {
    if (error instanceof DOMException && error.name === 'AbortError') {
      return new HttpAbortedError(error.message, request, error);
    }

    return new HttpInterruptedError(
      error instanceof Error ? error.message : 'Unknown fetch adapter error',
      request,
      error,
    );
  }

  protected async makeResponseError(request: Request, response: Response): Promise<unknown> {
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
  }

  protected async transformRequest(context: {}, request: Request) {
    return sequentialTransform([
      ...this.requestTransformers,
      ...(consumeRequestConfig(context, null)?.requestTransformers ?? []),
    ], request);
  }

  protected async transformResponse(context: {}, response: Response) {
    return sequentialTransform([
      ...this.responseTransformers,
      ...(consumeRequestConfig(context, null)?.responseTransformers ?? []),
    ], response);
  }

  protected async transformError(context: {}, error: unknown) {
    return sequentialTransform([
      ...this.errorTransformers,
      ...(consumeRequestConfig(context, null)?.errorTransformers ?? []),
    ], error);
  }
}
