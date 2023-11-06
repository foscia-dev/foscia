import { ModelInstance } from '@foscia/core';
import { ObjectDeserializer, ObjectExtractedData } from '@foscia/object';
import {
  DataExtractor,
  DataReader,
  RestDeserializerConfig,
  RestNewResource,
} from '@foscia/rest/types';
import { applyConfig } from '@foscia/shared';

export default class RestDeserializer extends ObjectDeserializer<Response, RestNewResource> {
  private dataReader: DataReader;

  private dataExtractor: DataExtractor | null = null;

  public constructor(config: RestDeserializerConfig) {
    super(config);

    this.dataReader = config.dataReader;

    this.configure(config);
  }

  public configure(config: RestDeserializerConfig, override = true) {
    applyConfig(this, config, override);
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
  protected async extractData(response: Response): Promise<ObjectExtractedData<RestNewResource>> {
    const document = await this.dataReader(response);

    return {
      resources: this.dataExtractor ? await this.dataExtractor(document) : document,
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
