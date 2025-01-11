import { Dictionary, tap } from '@foscia/shared';

/**
 * Deeply serialize given query params (including objects)
 * using {@link URLSearchParams | `URLSearchParams`}.
 *
 * @param params
 *
 * @category Utilities
 *
 * @example
 * ```typescript
 * import { deepParamsSerializer } from '@foscia/http';
 *
 * console.log(deepParamsSerializer({
 *   search: 'foo', sort: 'title', filter: { category: 'news' },
 * });
 * // search=foo&sort=title&filter[category]=news
 * ```
 */
export default (params: Dictionary<any>) => tap(new URLSearchParams(), (urlParams) => {
  const appendParam = (key: string, value: unknown) => {
    if (Array.isArray(value)) {
      value.forEach((subValue) => appendParam(`${key}[]`, subValue));
    } else if (value && typeof value === 'object') {
      Object.entries(value).forEach(
        ([subKey, subValue]) => appendParam(`${key}[${subKey}]`, subValue),
      );
    } else {
      const finalValue = value;
      if (finalValue !== undefined) {
        urlParams.append(key, String(finalValue));
      }
    }
  };

  Object.entries(params ?? {}).forEach(([key, value]) => {
    appendParam(key, value);
  });
}).toString() || undefined;
