import { Dictionary } from '@foscia/shared/types';

export default function applyConfig(
  configurable: Record<any, any>,
  config: Record<any, any>,
  override = true,
) {
  Object.assign(configurable, Object.entries(config).reduce((newConfig, [key, value]) => {
    if (value !== undefined && (override || configurable[key] === undefined)) {
      // eslint-disable-next-line no-param-reassign
      newConfig[key] = value;
    }

    return newConfig;
  }, {} as Dictionary));
}
