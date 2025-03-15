import { ModelComposableFactory } from '@foscia/core/model/types';
import { mapWithKeys, OmitNever } from '@foscia/shared';

/**
 * Modifiers available in a property factory.
 *
 * @internal
 */
export type PropFactoryModifiers<F> = OmitNever<{
  [K in keyof F]: F[K] extends (...args: infer A) => ModelComposableFactory<any>
    ? (...args: A) => any
    : never;
}>;

/**
 * Parse a property factory's modifiers.
 *
 * @param modifiers
 *
 * @internal
 */
export default <F extends ModelComposableFactory<any>>(
  modifiers: PropFactoryModifiers<F>,
) => mapWithKeys(modifiers, (modifier, key) => ({
  [key](this: ModelComposableFactory, ...args: unknown[]) {
    Object.assign(this.composable, modifier(...args));

    return this;
  },
})) as Pick<F, keyof PropFactoryModifiers<F>>;
