import { using } from '@foscia/shared';

/**
 * Make a {@link RefFactory | `RefFactory`} using {@link !WeakRef | `WeakRef`}
 * to manage expiration.
 *
 * @category Factories
 * @since 0.13.0
 */
export default () => <V extends WeakKey>(value: V) => using(
  new WeakRef(value),
  (ref) => () => (ref.deref() ?? null),
);
