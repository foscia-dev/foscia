import isInstance from '@foscia/core/models/definition/utilities/isInstance';
import getModelProp from '@foscia/core/models/definition/utilities/getModelProp';
import onPropertyWrite from '@foscia/core/models/hooks/onPropertyWrite';
import { ModelBelongsToProp, ModelInstance, ModelMorphToProp } from '@foscia/core/models/types';
import guessRelationForeignKey from '@foscia/core/relations/utilities/guessRelationForeignKey';
import guessRelationOwnerKey from '@foscia/core/relations/utilities/guessRelationOwnerKey';

/**
 * Init a model relation foreign key hook.
 *
 * @param prop
 *
 * @internal
 */
export default function initModelRelationForeignKeyHook<
  T extends ModelInstance | null,
  I extends ModelInstance,
>(prop: ModelBelongsToProp<T, I> | ModelMorphToProp<T, I>) {
  const foreignProp = getModelProp(prop.parent, guessRelationForeignKey(prop));
  if (foreignProp) {
    onPropertyWrite(prop.parent, prop.key, (event) => {
      const resolveNextValue = () => {
        if (isInstance(event.next)) {
          const ownerPrimaryProp = getModelProp(event.next.$model, guessRelationOwnerKey(prop));
          if (ownerPrimaryProp) {
            return ownerPrimaryProp.get(event.next);
          }
        }

        return null;
      };

      foreignProp.set(event.instance, resolveNextValue());
    });
  }
}
