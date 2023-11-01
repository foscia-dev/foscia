import InvalidContextError from '@foscia/core/errors/invalidContextError';
import { isNil } from '@foscia/shared';

export default function consumeContext<
  Context extends {},
  Key extends keyof Context,
  Default = never,
>(
  context: Context,
  key: Key,
  enhancers: string[],
  defaultValue?: Default,
): Exclude<Context[Key] | Default, undefined> {
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
}
