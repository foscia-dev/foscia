import logger from '@foscia/core/logger/logger';
import isRelationDef from '@foscia/core/model/props/checks/isRelationDef';
import isSingularRelationDef from '@foscia/core/model/props/checks/isSingularRelationDef';
import forceFill from '@foscia/core/model/utilities/forceFill';
import guessRelationInverses from '@foscia/core/model/props/utilities/guessRelationInverses';
import { ModelInstance, ModelRelation } from '@foscia/core/model/types';
import { Arrayable, isNil, using, wrap } from '@foscia/shared';

/**
 * Attach a relation inverse of related instances (if enabled).
 * If inverse is automatic, it will guess, verify and save inverse before
 * attaching parent. If automatic inverse do not pass verifications, it
 * will be logged as a warning and will be disabled.
 *
 * @param parent
 * @param def
 * @param related
 *
 * @internal
 */
export default (
  parent: ModelInstance,
  def: ModelRelation,
  related: Arrayable<ModelInstance> | null,
) => {
  const instances = wrap(related);
  if (instances.length && !isNil(def.inverse) && def.inverse !== false) {
    if (typeof def.inverse !== 'string') {
      // eslint-disable-next-line no-param-reassign
      def.inverse = using(
        wrap((parent.$model.$config.guessRelationInverse ?? guessRelationInverses)(def)),
        (inverseKeys) => inverseKeys.reduce((rel, key) => (
          rel ?? instances[0].$model.$schema[key]?.key as string | undefined
        ), undefined as string | undefined),
      );
    }

    const inverseKey = def.inverse as string | undefined;
    if (instances.some((instance) => {
      const inverse = (
        inverseKey ? instance.$model.$schema[inverseKey] : undefined
      );
      if (inverse && isRelationDef(inverse)) {
        if (isSingularRelationDef(inverse)) {
          return false;
        }

        logger.warn(`\`${inverseKey}\` inverse for \`${parent.$model.$type}.${def.key}\` must be singular. Inverse has been disabled.`);

        return true;
      }

      logger.warn(`Could not found inverse for \`${parent.$model.$type}.${def.key}\`. Inverse has been disabled.`);

      return true;
    })) {
      // eslint-disable-next-line no-param-reassign
      def.inverse = false;

      return;
    }

    instances.forEach((instance) => forceFill(instance, { [inverseKey!]: parent }));
  }
};
