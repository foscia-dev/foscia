import JsonApiDeserializer from '@foscia/jsonapi/jsonApiDeserializer';

export default function makeJsonApiDeserializer() {
  return {
    deserializer: new JsonApiDeserializer(),
  };
}
