/**
 * Make a {@link RefFactory | `RefFactory`} using {@link !WeakRef | `WeakRef`}
 * to manage expiration.
 *
 * @category Factories
 * @since 0.13.0
 */
export default function makeWeakRefFactory() {
  return <V extends WeakKey>(value: V) => {
    const ref = new WeakRef(value);

    return () => ref.deref() ?? null;
  };
}
