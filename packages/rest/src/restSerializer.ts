import { ModelInstance, ModelRelation } from '@foscia/core';
import { ObjectSerializer } from '@foscia/object';
import { RestNewResource, RestSerializerConfig } from '@foscia/rest/types';
import { Dictionary } from '@foscia/shared';

export default class RestSerializer extends ObjectSerializer<Dictionary> {
  declare public readonly $config: RestSerializerConfig;

  declare public configure: (config: Partial<RestSerializerConfig>, override?: boolean) => this;

  public constructor(config?: RestSerializerConfig) {
    super(config);
  }

  public async serialize(instance: ModelInstance, context: {}) {
    const resource = await super.serialize(instance, context);

    return this.$config.dataWrapper ? this.$config.dataWrapper(resource) : resource;
  }

  /**
   * @inheritDoc
   */
  protected async makeResource(instance: ModelInstance) {
    return { id: instance.id, lid: instance.lid };
  }

  /**
   * @inheritDoc
   */
  protected async hydratePropInResource(
    resource: RestNewResource,
    serializedKey: string,
    serializedValue: unknown,
  ) {
    Object.assign(resource, {
      [serializedKey]: serializedValue,
    });
  }

  /**
   * @inheritDoc
   */
  protected async serializeRelatedInstance(
    _instance: ModelInstance,
    _def: ModelRelation,
    related: ModelInstance,
  ) {
    // TODO Provide configuration for related instance serialization.
    return related.id;
  }
}
