import { ModelPropFactoryDefinition } from '@foscia/core/model/props/builders/types';
import { ModelProp, ModelPropFactory } from '@foscia/core/model/types';
import { SYMBOL_MODEL_PROP, SYMBOL_MODEL_PROP_FACTORY } from '@foscia/core/symbols';

/**
 * Make a property definition factory.
 *
 * @param prop
 *
 * @internal
 */
export default <P extends ModelProp>(prop: ModelPropFactoryDefinition<P>) => ({
  $FOSCIA_TYPE: SYMBOL_MODEL_PROP_FACTORY,
  make: (parent, key) => ({
    ...(prop ?? {}),
    $FOSCIA_TYPE: SYMBOL_MODEL_PROP,
    parent,
    key,
  }),
} as ModelPropFactory<P>);
