import { coreExtensions, crudExtensions, hooksExtensions } from '@foscia/core';
import { httpExtensions } from '@foscia/http';
import jsonApiExtensions from '@foscia/jsonapi/jsonApiExtensions';

export default {
  ...coreExtensions,
  ...crudExtensions,
  ...hooksExtensions,
  ...httpExtensions,
  ...jsonApiExtensions,
};
