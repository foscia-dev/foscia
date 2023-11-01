import { AllData, ModelInstance, OneData } from '@foscia/core';
import { JsonApiDeserializedData } from '@foscia/jsonapi/jsonApiDeserializer';

/**
 * Append the JSON:API document object to data object.
 * Use it as the parameter of `allUsing` and `oneUsing` runners.
 *
 * @param data
 */
export default function usingDocument<
  I extends ModelInstance,
  DD extends JsonApiDeserializedData<I>,
  D extends OneData<Response, DD, I> | AllData<Response, DD, I>,
>(data: D) {
  return {
    ...data,
    document: data.deserialized.document,
  };
}
