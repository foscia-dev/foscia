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
 * Context value representing a HTTP request config.
 */
export type HttpRequestConfig = {
  request?: Request;
  method?: HttpMethod;
  baseURL?: string;
  path?: string;
  params?: Dictionary<any> | string;
  headers?: Dictionary<string>;
  body?: unknown;
  bodyAs?: BodyAsTransformer;
  signal?: AbortSignal | null;
  modelPaths?: boolean;
  responseReader?: HttpResponseReader;
  requestTransformers?: RequestTransformer[];
  responseTransformers?: ResponseTransformer[];
  errorTransformers?: ErrorTransformer[];
};

/**
 * Context containing a HTTP request config.
 */
export type ConsumeHttpRequestConfig = {
  httpRequestConfig: HttpRequestConfig;
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
