import { ModelInstance } from '@foscia/core';
import { ObjectDeserializer, ObjectExtractedData } from '@foscia/object';
import { RestDeserializerConfig, RestNewResource } from '@foscia/rest/types';

export default class RestDeserializer extends ObjectDeserializer<RestNewResource> {
  declare public readonly $config: RestDeserializerConfig;

  declare public configure: (config: Partial<RestDeserializerConfig>, override?: boolean) => this;

  public constructor(config: RestDeserializerConfig) {
    super(config);
  }

  /**
   * @inheritDoc
   */
  protected async makeDeserializedData(instances: ModelInstance[]) {
    return { instances };
  }

  /**
   * @inheritDoc
   */
  protected async extractData(rawData: any): Promise<ObjectExtractedData<RestNewResource>> {
    return {
      resources: this.$config.dataExtractor ? await this.$config.dataExtractor(rawData) : rawData,
    };
  }

  /**
   * @inheritDoc
   */
  protected async extractOptionalIdentifier(resource: RestNewResource) {
    return resource;
  }

  /**
   * @inheritDoc
   */
  protected async extractPropValue(resource: RestNewResource, serializedKey: string) {
    return resource[serializedKey];
  }
}
