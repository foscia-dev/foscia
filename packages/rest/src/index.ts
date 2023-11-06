import makeJsonRestAdapter from '@foscia/rest/blueprints/makeJsonRestAdapter';
import makeJsonRestDeserializer from '@foscia/rest/blueprints/makeJsonRestDeserializer';
import makeJsonRestSerializer from '@foscia/rest/blueprints/makeJsonRestSerializer';
import jsonRestExtensions from '@foscia/rest/jsonRestExtensions';
import jsonRestStarterExtensions from '@foscia/rest/jsonRestStarterExtensions';
import RestAdapter from '@foscia/rest/restAdapter';
import RestDeserializer from '@foscia/rest/restDeserializer';
import RestSerializer from '@foscia/rest/restSerializer';

export * from '@foscia/rest/types';

export {
  makeJsonRestAdapter,
  RestAdapter,
  makeJsonRestDeserializer,
  RestDeserializer,
  makeJsonRestSerializer,
  RestSerializer,
  jsonRestExtensions,
  jsonRestStarterExtensions,
};
