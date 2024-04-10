import { AdapterI } from '@foscia/core';
import { Awaitable, Dictionary } from '@foscia/shared';

/**
 * The HTTP method to use in request.
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
 */
export type HttpRequestConfig =
  & {
    request?: Request;
    method?: HttpMethod;
    baseURL?: string;
    path?: string;
    params?: Dictionary<any> | string;
    headers?: Dictionary<string>;
    body?: unknown;
    bodyAs?: BodyAsTransformer;
    modelPaths?: boolean;
    responseReader?: HttpResponseReader;
    requestTransformers?: RequestTransformer[];
    responseTransformers?: ResponseTransformer[];
    errorTransformers?: ErrorTransformer[];
  }
  & Pick<RequestInit, HttpRequestInitPickKey>;

/**
 * Context containing a HTTP request config.
 */
export type ConsumeHttpRequestConfig = {
  httpRequestConfig: HttpRequestConfig;
};

/**
 * Prepared context for URL building.
 */
export type HttpURLContext = {
  baseURL: string;
  modelPath?: string;
  idPath?: string;
  relationPath?: string;
  additionalPath?: string;
};

/**
 * Read the response's content to a deserializable data.
 */
export type HttpResponseReader<Data = any> = (response: Response) => Promise<Data>;

/**
 * The configuration for the HTTP adapter implementation.
 */
export type HttpAdapterConfig<Data = any> = {
  fetch?: typeof fetch;
  baseURL?: string | null;
  buildURL?: (urlContext: HttpURLContext, context: {}) => string;
  serializeParams: HttpParamsSerializer;
  defaultHeaders?: Dictionary<string>;
  defaultBodyAs?: BodyAsTransformer | null;
  defaultResponseReader?: HttpResponseReader<Data>;
  appendParams?: (context: {}) => Awaitable<Dictionary<any>>;
  appendHeaders?: (context: {}) => Awaitable<Dictionary<string>>;
  requestTransformers?: RequestTransformer[];
  responseTransformers?: ResponseTransformer[];
  errorTransformers?: ErrorTransformer[];
};

export interface HttpAdapter<Data = any> extends AdapterI<Response, Data> {
}

export type HttpParamsSerializer = (params: Dictionary) => string | undefined;

export type RequestTransformer = (request: Request) => Awaitable<Request>;
export type ResponseTransformer = (response: Response) => Awaitable<Response>;
export type ErrorTransformer = (error: unknown) => Awaitable<unknown>;
export type BodyAsTransformer = (body: unknown, headers: Dictionary<string>) => Awaitable<BodyInit>;
