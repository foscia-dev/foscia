import isAction from '@foscia/core/actions/checks/isAction';
import { Action, ConsumedContextFrom } from '@foscia/core/actions/types';
import InvalidContextError from '@foscia/core/errors/invalidContextError';
import { Dictionary, isNil } from '@foscia/shared';

const resolveContext = (
  context: Dictionary,
  key: string,
  defaultValue?: unknown,
) => {
  const value = context[key];
  if (isNil(value)) {
    if (defaultValue !== undefined) {
      return defaultValue;
    }

    throw new InvalidContextError(`Cannot access \`${String(key)}\` context.`);
  }

  return value;
};

/**
 * Make a context consumer.
 *
 * @param key
 *
 * @internal
 */
export default ((key: string) => (
  from: Action | Dictionary,
  defaultValue?: unknown,
) => (
  isAction(from)
    ? new Promise<any>((resolve) => {
      from.useContext().then(
        (ctx) => resolve(resolveContext(ctx, key, defaultValue)),
      );
    })
    : resolveContext(from, key, defaultValue)
)) as <Key extends string & keyof Relevant, Relevant extends {}>(
  key: Key,
) => {
  /**
   * Consume an action's context property.
   * If the property is null or undefined, it will return the default value
   * (if set) or throw an error.
   *
   * @param from
   * @param defaultValue
   *
   * @internal
   */<Context extends {}, Default = never>(
    from: Action<Context & Partial<Relevant>>,
    defaultValue?: Default,
  ): Promise<ConsumedContextFrom<Key, Relevant, Context, Default>>
  /**
   * Consume a context property.
   * If the property is null or undefined, it will return the default value
   * (if set) or throw an error.
   *
   * @param from
   * @param defaultValue
   *
   * @internal
   */<Context extends {}, Default = never>(
    from: Context & Partial<Relevant>,
    defaultValue?: Default,
  ): ConsumedContextFrom<Key, Relevant, Context, Default>;
};
