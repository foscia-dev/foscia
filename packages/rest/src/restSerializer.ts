import { ModelInstance, ModelRelation } from '@foscia/core';
import { ObjectSerializer } from '@foscia/object';
import { DataWrapper, RestNewResource, RestSerializerConfig } from '@foscia/rest/types';
import { applyConfig, Dictionary } from '@foscia/shared';

export default class RestSerializer extends ObjectSerializer<Dictionary> {
  private dataWrapper: DataWrapper | null = null;

  public constructor(config?: RestSerializerConfig) {
    super(config);

    this.configure(config ?? {});
  }

  public configure(config: RestSerializerConfig, override = true) {
    applyConfig(this, config, override);
  }

  public async serialize(instance: ModelInstance, context: {}) {
    const resource = await super.serialize(instance, context);

    return this.dataWrapper ? this.dataWrapper(resource) : resource;
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
