import makePropFactory from '@foscia/core/model/props/builders/makePropFactory';
import {
  ModelPendingProp,
  ModelPropChainableFactory,
} from '@foscia/core/model/props/builders/types';
import { ModelProp } from '@foscia/core/model/types';
import { Dictionary, mapWithKeys } from '@foscia/shared';

/**
 * Make a property definition chainable factory supporting
 * given definition modifiers.
 *
 * @param pendingProp
 * @param modifiers
 *
 * @internal
 */
const makePropChainableFactory = <
  P extends ModelProp,
  M extends Dictionary<(...args: any[]) => Partial<P>>,
>(
  pendingProp: ModelPendingProp<P>,
  modifiers: M,
): ModelPropChainableFactory<P, M> => makePropFactory(
  pendingProp,
  mapWithKeys(modifiers, (modifier, key) => ({
    [key]: (...args: Parameters<M[typeof key]>) => makePropChainableFactory({
      ...pendingProp,
      ...modifier(...args),
    }, modifiers),
  })),
) as ModelPropChainableFactory<P, M>;

export default makePropChainableFactory;
