import { AllData, OneData } from '@foscia/core';
import { JsonApiDeserializedData, JsonApiDocument } from '@foscia/jsonapi/types';

/**
 * Append the {@link JsonApiDocument | JSON:API document object} to data object.
 * Use it as the parameter of `all` or `one` runners.
 *
 * @param data
 *
 * @category Runners
 *
 * @example
 * ```typescript
 * import { query, all } from '@foscia/core';
 * import { usingDocument } from '@foscia/jsonapi';
 *
 * const data = await action(
 *   query(Post),
 *   all(usingDocument),
 * );
 *
 * console.log(data.instances); // Post array.
 * console.log(data.document);  // JSON:API document, with meta, etc.
 * ```
 */
export default <
  Deserialized extends JsonApiDeserializedData<any>,
  Data extends OneData<any, Deserialized, any> | AllData<any, Deserialized, any>,
>(data: Data): Data & { document: JsonApiDocument; } => ({
  ...data,
  document: data.deserialized.document,
});
