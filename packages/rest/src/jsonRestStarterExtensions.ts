import { coreExtensions, crudExtensions, hooksExtensions } from '@foscia/core';
import { httpExtensions } from '@foscia/http';
import jsonRestExtensions from '@foscia/rest/jsonRestExtensions';

export default function jsonRestStarterExtensions() {
  return {
    ...coreExtensions(),
    ...crudExtensions(),
    ...hooksExtensions(),
    ...httpExtensions(),
    ...jsonRestExtensions(),
  };
}
