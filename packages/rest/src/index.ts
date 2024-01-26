import makeJsonRestAdapter from '@foscia/rest/blueprints/makeJsonRestAdapter';
import makeJsonRestDeserializer from '@foscia/rest/blueprints/makeJsonRestDeserializer';
import makeJsonRestSerializer from '@foscia/rest/blueprints/makeJsonRestSerializer';
import jsonRestExtensions from '@foscia/rest/jsonRestExtensions';
import jsonRestStarterExtensions from '@foscia/rest/jsonRestStarterExtensions';
import makeIncludeParam from '@foscia/rest/makeIncludeParam';
import makeRestAdapterWith from '@foscia/rest/makeRestAdapterWith';
import RestDeserializer from '@foscia/rest/restDeserializer';
import RestSerializer from '@foscia/rest/restSerializer';

export * from '@foscia/rest/types';

export {
  makeRestAdapterWith,
  makeJsonRestAdapter,
  makeJsonRestDeserializer,
  RestDeserializer,
  makeJsonRestSerializer,
  RestSerializer,
  makeIncludeParam,
  jsonRestExtensions,
  jsonRestStarterExtensions,
};
