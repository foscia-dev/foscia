import isInstance from '@foscia/core/models/definition/utilities/isInstance';
import getModelProp from '@foscia/core/models/definition/utilities/getModelProp';
import onPropertyWrite from '@foscia/core/models/hooks/onPropertyWrite';
import { ModelInstance, ModelMorphToProp } from '@foscia/core/models/types';
import guessRelationForeignTypeKey
  from '@foscia/core/relations/utilities/guessRelationForeignTypeKey';
import resolveMorphType from '@foscia/core/relations/utilities/resolveMorphType';

/**
 * Init a model relation foreign type hook.
 *
 * @param prop
 *
 * @internal
 */
export default function initModelRelationForeignTypeKeyHook<
  T extends ModelInstance | null,
  I extends ModelInstance,
>(prop: ModelMorphToProp<T, I>) {
  const foreignTypeProp = getModelProp(prop.parent, guessRelationForeignTypeKey(prop));
  if (foreignTypeProp) {
    onPropertyWrite(prop.parent, prop.key, (event) => {
      const resolveNextValue = () => {
        if (isInstance(event.next)) {
          return resolveMorphType(event.next.$model);
        }

        return null;
      };

      foreignTypeProp.set(event.instance, resolveNextValue() as any);
    });
  }
}
