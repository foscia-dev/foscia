/**
 * Merge two config objects.
 *
 * @param original
 * @param config
 * @param override
 */
export default function mergeConfig<C extends {}>(
  original: C,
  config: Partial<C>,
  override = true,
): C {
  return {
    ...original,
    ...(Object.entries(config) as [keyof C, C[keyof C]][]).reduce((keptConfig, [key, value]) => {
      if (value !== undefined && (override || original[key] === undefined)) {
        // eslint-disable-next-line no-param-reassign
        keptConfig[key] = value;
      }

      return keptConfig;
    }, {} as Partial<C>),
  };
}
