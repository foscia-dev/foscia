import RestDeserializer from '@foscia/rest/restDeserializer';
import { RestDeserializerConfig } from '@foscia/rest/types';

export default function makeJsonRestDeserializer(config: Partial<RestDeserializerConfig> = {}) {
  return {
    deserializer: new RestDeserializer(config),
  };
}
