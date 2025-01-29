import { AllData, ModelInstance, OneData } from '@foscia/core';
import { JsonApiDeserializedData } from '@foscia/jsonapi/types';

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
 * const data = await action().run(
 *   query(Post),
 *   all(usingDocument),
 * );
 *
 * console.log(data.instances); // Post array.
 * console.log(data.document);  // JSON:API document, with meta, etc.
 * ```
 */
export default <
  I extends ModelInstance,
  Deserialized extends JsonApiDeserializedData<I>,
  Data extends OneData<any, Deserialized, I> | AllData<any, Deserialized, I>,
>(data: Data) => ({ ...data, document: data.deserialized.document });
