import InvalidContextError from '@foscia/core/errors/invalidContextError';
import { isNil } from '@foscia/shared';

/**
 * Consume a context property. If the property is null or undefined, it will
 * return the default value (if set), or throw and error listing the enhancers
 * that could be used to provide the context property.
 *
 * @param context
 * @param key
 * @param enhancers
 * @param defaultValue
 *
 * @internal
 */
export default <
  Context extends {},
  Key extends keyof Context,
  Default = never,
>(
  context: Context,
  key: Key,
  enhancers: string[],
  defaultValue?: Default,
): Exclude<Context[Key] | Default, undefined> => {
  const value = context[key];
  if (isNil(value)) {
    if (defaultValue !== undefined) {
      return defaultValue as any;
    }

    const enhancersList = enhancers.map((e) => `- \`${e}\``).join('\n');

    throw new InvalidContextError(
      `Cannot access \`${String(key)}\` context. You should use one of the following enhancers before:\n${enhancersList}`,
    );
  }

  return value! as any;
};
