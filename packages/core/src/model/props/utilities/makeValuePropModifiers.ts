import makePropFactoryModifiers from '@foscia/core/model/props/utilities/makePropFactoryModifiers';

/**
 * Make a value property factory's modifiers.
 *
 * @internal
 */
export default () => ({
  ...makePropFactoryModifiers(),
  readOnly: (readOnly?: boolean) => ({ readOnly }),
  default: (defaultValue: unknown | (() => unknown)) => ({ default: defaultValue }),
  nullable: () => ({}),
});
