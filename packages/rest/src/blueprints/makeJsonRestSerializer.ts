import RestSerializer from '@foscia/rest/restSerializer';
import { RestSerializerConfig } from '@foscia/rest/types';

export default function makeJsonRestSerializer(config: Partial<RestSerializerConfig> = {}) {
  return {
    serializer: new RestSerializer(config),
  };
}
