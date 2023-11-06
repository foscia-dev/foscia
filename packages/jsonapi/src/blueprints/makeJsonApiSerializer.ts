import JsonApiSerializer from '@foscia/jsonapi/jsonApiSerializer';

export default function makeJsonApiSerializer() {
  return {
    serializer: new JsonApiSerializer(),
  };
}
