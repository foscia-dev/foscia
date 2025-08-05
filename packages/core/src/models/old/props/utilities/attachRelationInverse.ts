import logger from '@foscia/core/logger/logger';
import isModelHasOneOrManyRelation
  from '@foscia/core/models/definition/utilities/isModelHasOneOrManyRelation';
import { ModelInstance, ModelRelationProp } from '@foscia/core/models/types';
import guessRelationInverses from '@foscia/core/relations/utilities/guessRelationInverses';
import { Arrayable, wrap } from '@foscia/shared';

/**
 * Attach a relation inverse of related instances (if enabled).
 * If inverse is automatic, it will guess, verify and save inverse before
 * attaching parent. If automatic inverse do not pass verifications, it
 * will be logged as a warning and will be disabled.
 *
 * @param parent
 * @param prop
 * @param related
 *
 * @internal
 */
export default <
  Instance extends ModelInstance,
  Relation extends ModelRelationProp<Value, Instance>,
  Value extends Arrayable<Related> | null,
  Related extends ModelInstance,
>(
  parent: Instance,
  prop: Relation,
  related: Value,
) => {
  if (!isModelHasOneOrManyRelation(prop)) {
    return;
  }

  const instances = wrap(related);
  if (instances.length && prop.inverse) {
    if (typeof prop.inverse !== 'string') {
      const inverseKeys = wrap(
        (parent.$model.$config.guessRelationInverse ?? guessRelationInverses)(prop),
      );

      // eslint-disable-next-line no-param-reassign
      prop.inverse = inverseKeys.reduce((rel, key) => (
        rel ?? instances[0].$model.$schema.get(key)?.key as string | undefined
      ), undefined as string | undefined);
    }

    if (prop.inverse) {
      const disableInverse = (message: string) => {
        logger.warn(`${message} (future inverse resolving has been disabled).`);

        // eslint-disable-next-line no-param-reassign
        prop.inverse = false;
      };

      instances.forEach((instance) => {
        if (typeof prop.inverse === 'string') {
          const inverse = instance.$model.$schema.get(prop.inverse);
          if (!inverse) {
            disableInverse(`Could not found inverse for \`${parent.$model.$type}.${prop.key}\``);

            return;
          }

          if (isModelHasOneOrManyRelation(inverse)) {
            disableInverse(
              `\`${inverse.key}\` inverse for \`${parent.$model.$type}.${prop.key}\` is not a "has one or many" relation`,
            );

            return;
          }

          inverse.set(instance, parent);
        }
      });
    }
  }
};
