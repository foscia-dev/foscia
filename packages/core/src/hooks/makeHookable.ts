import { Hookable, HooksDefinition, HooksRegistrar } from '@foscia/core/hooks/types';

/**
 * Transform an object to a hookable object.
 *
 * @param object
 * @param hooks
 *
 * @internal
 */
export default function makeHookable<T extends {}, D extends HooksDefinition = {}>(
  object: T,
  hooks: HooksRegistrar<D> = {},
): T & Hookable<D> {
  return Object.assign(object, {
    $hooks: hooks,
  });
}
