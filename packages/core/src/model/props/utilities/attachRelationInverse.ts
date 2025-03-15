import logger from '@foscia/core/logger/logger';
import isRelation from '@foscia/core/model/props/checks/isRelation';
import isSingularRelation from '@foscia/core/model/props/checks/isSingularRelation';
import guessRelationInverses from '@foscia/core/relations/utilities/guessRelationInverses';
import { ModelInstance, ModelRelation } from '@foscia/core/model/types';
import forceFill from '@foscia/core/model/utilities/forceFill';
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
export default (
  parent: ModelInstance,
  prop: ModelRelation,
  related: Arrayable<ModelInstance> | null,
) => {
  const instances = wrap(related);
  if (instances.length && prop.inverse) {
    if (typeof prop.inverse !== 'string') {
      const inverseKeys = wrap(
        (parent.$model.$config.guessRelationInverse ?? guessRelationInverses)(prop),
      );

      // eslint-disable-next-line no-param-reassign
      prop.inverse = inverseKeys.reduce((rel, key) => (
        rel ?? instances[0].$model.$schema[key]?.key as string | undefined
      ), undefined as string | undefined);
    }

    const inverseKey = prop.inverse as string | undefined;
    if (instances.some((instance) => {
      const inverse = (
        inverseKey ? instance.$model.$schema[inverseKey] : undefined
      );
      if (inverse && isRelation(inverse)) {
        if (isSingularRelation(inverse)) {
          return false;
        }

        logger.warn(`\`${inverseKey}\` inverse for \`${parent.$model.$type}.${prop.key}\` must be singular. Inverse has been disabled.`);

        return true;
      }

      logger.warn(`Could not found inverse for \`${parent.$model.$type}.${prop.key}\`. Inverse has been disabled.`);

      return true;
    })) {
      // eslint-disable-next-line no-param-reassign
      prop.inverse = false;

      return;
    }

    instances.forEach((instance) => forceFill(instance, { [inverseKey!]: parent }));
  }
};
