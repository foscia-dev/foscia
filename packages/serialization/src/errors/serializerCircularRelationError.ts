import { ModelRelation, ModelSnapshot, SerializerError } from '@foscia/core';
import { SerializerCircularRelationBehavior } from '@foscia/serialization/types';

/**
 * Error which occurs on circular relation detection during serialization.
 *
 * @group Errors
 */
export default class SerializerCircularRelationError extends SerializerError {
  public readonly behavior: SerializerCircularRelationBehavior;

  public constructor(
    snapshot: ModelSnapshot,
    relation: ModelRelation,
    behavior: SerializerCircularRelationBehavior,
  ) {
    super(
      `Circular relation detected on \`${snapshot.$instance.$model.$type}.${relation.key}\` during serialization. Handling it with behavior \`${behavior}\`.`,
    );

    this.behavior = behavior;
  }
}
