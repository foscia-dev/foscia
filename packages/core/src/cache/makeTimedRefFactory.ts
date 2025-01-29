import { tap } from '@foscia/shared';

/**
 * Config for the timed ref factory.
 *
 * @interface
 *
 * @internal
 */
export type TimedRefFactoryConfig = {
  /**
   * Lifetime of a reference before expiration in seconds.
   * Defaults to `300` (5 minutes).
   */
  lifetime?: number;
  /**
   * When enabled, access to a reference will reset the expiration.
   * Defaults to `true`.
   */
  postpone?: boolean;
};

/**
 * Make a {@link RefFactory | `RefFactory`} using {@link !setTimeout | `setTimeout`}
 * to manage expiration.
 *
 * @category Factories
 * @since 0.13.0
 */
export default (config?: TimedRefFactoryConfig) => <V>(value: V) => {
  let expirationTimeout: ReturnType<typeof setTimeout> | undefined;
  const scheduleExpiration = () => {
    clearTimeout(expirationTimeout);
    expirationTimeout = setTimeout(() => {
      expirationTimeout = undefined;
    }, (config?.lifetime ?? (5 * 60)) * 1000);
  };

  scheduleExpiration();

  return () => (
    expirationTimeout === undefined ? null : tap(value, () => {
      if (config?.postpone ?? true) {
        scheduleExpiration();
      }
    })
  );
};
