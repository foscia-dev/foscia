import mergeConfig from '@foscia/shared/configs/mergeConfig';

/**
 * Transform an object to add `$config` readonly property and `configure`
 * method.
 *
 * @param object
 * @param original
 */
export default function makeConfigurable(object: {}, original: {}) {
  const $config = { ...original };

  Object.defineProperty(object, '$config', { value: $config });
  Object.defineProperty(object, 'configure', {
    value: (config: {}, override = true) => {
      Object.assign($config, mergeConfig($config, config, override));

      return object;
    },
  });
}
