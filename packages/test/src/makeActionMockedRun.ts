import { ActionMockedRunOptions } from '@foscia/test/types';

/**
 * Create a new mocked action run.
 *
 * @param options
 */
export default function makeActionMockedRun<C extends {} = any>(
  options: ActionMockedRunOptions<C>,
) {
  let remaining = options.times ?? null;

  const shouldRun = async (context: C) => (
    options.predicate ? (await options.predicate(context) ?? true) : true
  );

  const shouldForget = async () => (remaining !== null && remaining < 1);

  const run = async (context: C) => {
    if (remaining !== null) {
      remaining -= 1;
    }

    if (options.expectation) {
      await options.expectation(context);
    }

    return typeof options.result === 'function'
      ? options.result(context)
      : options.result;
  };

  return {
    shouldRun,
    shouldForget,
    run,
  };
}
