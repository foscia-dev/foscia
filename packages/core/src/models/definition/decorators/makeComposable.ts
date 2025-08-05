import makeHookable from '@foscia/core/hooks/makeHookable';
import applyComposables from '@foscia/core/models/definition/internals/applyComposables';
import {
  ModelComposable,
  ModelComposableDecorator,
  ObjectClassUsing,
  ObjectInstanceUsing,
} from '@foscia/core/models/types';
import { Constructor, wrap } from '@foscia/shared/index';

/**
 * Create a composable decorator.
 *
 * @param composable
 * @param composables
 *
 * @category Factories
 *
 * @example
 * ```typescript
 * import { makeComposable } from '@foscia/core';
 *
 * const publishable = makeComposable((model) => class extends model {
 *   @attr() published!: boolean;
 * });
 *
 * @model()
 * class Post extends model.base([publishable]) {
 * }
 * ```
 */
const makeComposable: {
  <
    Class extends Constructor,
    Composable extends ModelComposableDecorator<Class>,
  >(
    composable: Composable,
  ): ModelComposable<Composable>;
  <
    Composables extends ModelComposableDecorator,
    Class extends ObjectClassUsing<Composables> & Constructor<ObjectInstanceUsing<Composables>>,
    Composable extends ModelComposableDecorator<Class>,
  >(
    composables: Composables[],
    composable: Composable,
  ): ModelComposable<Composable | Composables>;
} = (
  composables: ModelComposableDecorator | ModelComposableDecorator[],
  composable?: ModelComposableDecorator,
) => makeHookable((target: Constructor) => applyComposables([
  ...wrap(composables),
  ...wrap(composable),
], target));

export default makeComposable;
