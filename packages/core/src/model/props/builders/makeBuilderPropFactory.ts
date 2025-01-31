import makePropFactory from '@foscia/core/model/props/builders/makePropFactory';
import { ModelPropFactoryDefinition } from '@foscia/core/model/props/builders/types';
import { ModelProp, ModelPropFactory } from '@foscia/core/model/types';
import { Dictionary, mapWithKeys } from '@foscia/shared';

type BuilderPropFactory<
  P extends ModelProp,
  M extends Dictionary<(...args: any[]) => Partial<P>>,
> =
  & { [K in keyof M]: (...args: Parameters<M[K]>) => BuilderPropFactory<P, M>; }
  & ModelPropFactory<P>;

/**
 * Make a builder property definition factory supporting given modifiers.
 *
 * @param prop
 * @param modifiers
 *
 * @internal
 */
const makeBuilderPropFactory = <
  P extends ModelProp,
  M extends Dictionary<(...args: any[]) => Partial<P>>,
>(prop: ModelPropFactoryDefinition<P>, modifiers: M): BuilderPropFactory<P, M> => ({
  ...mapWithKeys(modifiers, (modifier, key) => ({
    [key]: (...args: Parameters<M[typeof key]>) => makeBuilderPropFactory({
      ...prop,
      ...modifier(...args),
    }, modifiers),
  })),
  ...makePropFactory(prop),
} as BuilderPropFactory<P, M>);

export default makeBuilderPropFactory;
