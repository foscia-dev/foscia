import { ModelInstance, ModelRelation, SerializerError } from '@foscia/core';
import { SerializerCircularRelationBehavior } from '@foscia/serialization/types';

/**
 * Error which occurs on circular relation detection during serialization.
 */
export default class SerializerCircularRelationError extends SerializerError {
  public readonly behavior: SerializerCircularRelationBehavior;

  public constructor(
    instance: ModelInstance,
    relation: ModelRelation,
    behavior: SerializerCircularRelationBehavior,
  ) {
    super(
      `Circular relation detected on \`${instance.$model.$type}.${relation.key}\` during serialization. Handling it with behavior \`${behavior}\`.`,
    );

    this.behavior = behavior;
  }
}
