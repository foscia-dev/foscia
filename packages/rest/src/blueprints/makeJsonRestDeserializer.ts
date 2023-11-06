import RestDeserializer from '@foscia/rest/restDeserializer';
import { RestDeserializerConfig } from '@foscia/rest/types';

export default function makeJsonRestDeserializer(config: Partial<RestDeserializerConfig> = {}) {
  return {
    deserializer: new RestDeserializer({
      dataReader: (response) => (
        response.status === 204 ? undefined : response.json()
      ),
      ...config,
    }),
  };
}
