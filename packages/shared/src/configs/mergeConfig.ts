/**
 * Merge two config objects.
 *
 * @param config
 * @param newConfig
 * @param override
 *
 * @internal
 */
export default <C extends {}>(
  config: C,
  newConfig: Partial<C>,
  override = true,
): C => ({
  ...config,
  ...(Object.entries(newConfig) as [keyof C, C[keyof C]][]).reduce((keptConfig, [key, value]) => {
    if (value !== undefined && (override || config[key] === undefined)) {
      // eslint-disable-next-line no-param-reassign
      keptConfig[key] = value;
    }

    return keptConfig;
  }, {} as Partial<C>),
});
