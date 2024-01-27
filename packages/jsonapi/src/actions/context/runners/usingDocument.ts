import { AllData, ModelInstance, OneData } from '@foscia/core';
import { JsonApiDeserializedData } from '@foscia/jsonapi/types';

/**
 * Append the JSON:API document object to data object.
 * Use it as the parameter of `allUsing` and `oneUsing` runners.
 *
 * @param data
 */
export default function usingDocument<
  I extends ModelInstance,
  Deserialized extends JsonApiDeserializedData<I>,
  Data extends OneData<any, Deserialized, I> | AllData<any, Deserialized, I>,
>(data: Data) {
  return {
    ...data,
    document: data.deserialized.document,
  };
}
