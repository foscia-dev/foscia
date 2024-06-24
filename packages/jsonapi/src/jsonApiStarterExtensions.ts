import { coreExtensions, crudExtensions, hooksExtensions } from '@foscia/core';
import { httpExtensions } from '@foscia/http';
import jsonApiExtensions from '@foscia/jsonapi/jsonApiExtensions';

export default function jsonApiStarterExtensions() {
  return {
    ...coreExtensions(),
    ...crudExtensions(),
    ...hooksExtensions(),
    ...httpExtensions(),
    ...jsonApiExtensions(),
  };
}
