import { Adapter } from '@foscia/core';
import { Awaitable, Dictionary, Transformer } from '@foscia/shared';

/**
 * The HTTP method to use in request.
 *
 * @internal
 */
export type HttpMethod =
  | 'get' | 'GET'
  | 'delete' | 'DELETE'
  | 'head' | 'HEAD'
  | 'options' | 'OPTIONS'
  | 'post' | 'POST'
  | 'put' | 'PUT'
  | 'patch' | 'PATCH'
  | 'purge' | 'PURGE'
  | 'link' | 'LINK'
  | 'unlink' | 'UNLINK';

/**
 * Keys which are simply inherited from request init.
 *
 * @internal
 */
export type HttpRequestInitPickKey =
  | 'cache'
  | 'credentials'
  | 'integrity'
  | 'keepalive'
  | 'mode'
  | 'redirect'
  | 'referrer'
  | 'referrerPolicy'
  | 'signal'
  | 'window';

/**
 * Context value representing a HTTP request config.
 *
 * @internal
 */
export type HttpRequestConfig =
  & {
    /**
     * Standard {@link !Request | `Request`} object.
     * If defined, it will ignore any other request config options.
     */
    request?: Request;
    /**
     * HTTP method.
     */
    method?: HttpMethod;
    /**
     * Base URL for request.
     */
    baseURL?: string;
    /**
     * Endpoint path to append after base URL and model paths.
     */
    path?: string;
    /**
     * Request query params.
     */
    params?: Dictionary<any> | string;
    /**
     * Request headers (will override default adapter headers).
     */
    headers?: Dictionary<string>;
    /**
     * Request body.
     */
    body?: unknown;
    /**
     * Override default body transformer.
     */
    bodyAs?: BodyAsTransformer;
    /**
     * Disable computing endpoint using model context values (model, ID, etc.).
     */
    modelPaths?: boolean;
    /**
     * Override default adapter response reader.
     */
    responseReader?: HttpResponseReader;
    /**
     * Transforms the {@link !Request | `Request`} object sequentially
     * (after adapter transformers).
     */
    requestTransformers?: RequestTransformer[];
    /**
     * Transforms the {@link !Response | `Response`} object sequentially
     * (after adapter transformers).
     */
    responseTransformers?: ResponseTransformer[];
    /**
     * Transforms the thrown error sequentially
     * (after adapter transformers).
     */
    errorTransformers?: ErrorTransformer[];
  }
  & Pick<RequestInit, HttpRequestInitPickKey>;

/**
 * Context containing a HTTP request config.
 *
 * @internal
 */
export type ConsumeHttpRequestConfig = {
  httpRequestConfig: HttpRequestConfig;
};

/**
 * Prepared context for URL building.
 *
 * @internal
 */
export type HttpURLContext = {
  /**
   * Request base URL.
   */
  baseURL: string;
  /**
   * Transformed model path.
   */
  modelPath?: string;
  /**
   * Transformed ID path.
   */
  idPath?: string;
  /**
   * Transformed relation path.
   */
  relationPath?: string;
  /**
   * Request path.
   */
  additionalPath?: string;
};

/**
 * Read the response's content to a deserializable data.
 *
 * @internal
 */
export type HttpResponseReader<Data = any> = (response: Response) => Promise<Data>;

/**
 * The configuration for the HTTP adapter implementation.
 *
 * @internal
 */
export type HttpAdapterConfig<Data = any> = {
  /**
   * {@link !fetch | `fetch`} API implementation to use.
   * Defaults to `globalThis.fetch`.
   */
  fetch?: typeof fetch;
  /**
   * Base URL. Defaults to `/`.
   */
  baseURL?: string | null;
  /**
   * Build the URL using the given contexts.
   * Defaults to `<baseURL><modelPath><idPath><relationPath><additionalPath>` joined with `/`.
   *
   * @param urlContext
   * @param context
   */
  buildURL?: (urlContext: HttpURLContext, context: {}) => string;
  /**
   * Serialize a query params object to a string.
   */
  serializeParams?: HttpParamsSerializer;
  /**
   * Initial headers for every request.
   */
  defaultHeaders?: Dictionary<string>;
  /**
   * Body transformer.
   * Defaults to {@link !JSON.stringify | `JSON.stringify()`} if body is not
   * a {@link !FormData | `FormData`}, {@link !URLSearchParams | `URLSearchParams`} or `undefined`.
   * When null, body won't be transformed.
   */
  defaultBodyAs?: BodyAsTransformer | null;
  /**
   * Response reader.
   * Defaults to {@link !Response#json | `response.json()`}.
   */
  defaultResponseReader?: HttpResponseReader<Data>;
  /**
   * Append query params to request based on context.
   * Returned params are **not** merged with other query
   * params, because request params might be a query string.
   *
   * @param context
   */
  appendParams?: (context: {}) => Awaitable<Dictionary<any>>;
  /**
   * Append headers to request based on context.
   * Returned headers are merged with other headers.
   *
   * @param context
   */
  appendHeaders?: (context: {}) => Awaitable<Dictionary<string>>;
  /**
   * Transforms the model path.
   */
  modelPathTransformer?: Transformer<string>;
  /**
   * Transforms the ID path.
   */
  idPathTransformer?: Transformer<string>;
  /**
   * Transforms the relation path.
   */
  relationPathTransformer?: Transformer<string>;
  /**
   * Transforms the {@link !Request | `Request`} object sequentially.
   */
  requestTransformers?: RequestTransformer[];
  /**
   * Transforms the {@link !Response | `Response`} object sequentially.
   */
  responseTransformers?: ResponseTransformer[];
  /**
   * Transforms the thrown error sequentially.
   */
  errorTransformers?: ErrorTransformer[];
};

/**
 * HTTP adapter.
 *
 * @internal
 */
export type HttpAdapter<Data = any> = Adapter<Response, Data>;

/**
 * HTTP query params serializer.
 *
 * @internal
 */
export type HttpParamsSerializer = (params: Dictionary) => string | undefined;

/**
 * Transforms a {@link !Request | `Request`} object.
 *
 * @internal
 */
export type RequestTransformer = (request: Request) => Awaitable<Request>;

/**
 * Transforms a {@link !Response | `Response`} object.
 *
 * @internal
 */
export type ResponseTransformer = (response: Response) => Awaitable<Response>;

/**
 * Transforms an unknown error.
 *
 * @internal
 */
export type ErrorTransformer = (error: unknown) => Awaitable<unknown>;

/**
 * Converts given body as a valid {@link !Request | `Request`} body.
 *
 * @internal
 */
export type BodyAsTransformer = (body: unknown, headers: Dictionary<string>) => Awaitable<BodyInit>;
