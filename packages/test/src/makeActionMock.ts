import { ActionMock, ActionTestContext } from '@foscia/test/types';

/**
 * Create an action mock.
 *
 * @internal
 */
export default () => {
  const options = {
    remaining: null as number | null,
    predicate: (() => true) as (context: ActionTestContext) => unknown,
    expectation: (() => undefined) as (context: ActionTestContext) => unknown,
    result: undefined as ((context: ActionTestContext) => unknown) | unknown,
  };

  return {
    once() {
      return this.times(1);
    },
    twice() {
      return this.times(2);
    },
    times(times: number) {
      options.remaining = times;

      return this;
    },
    when(predicate) {
      options.predicate = predicate;

      return this;
    },
    return(value) {
      options.result = value;

      return this;
    },
    expect(expectation) {
      options.expectation = expectation;

      return this;
    },
    shouldRun: async (testContext) => options.predicate(testContext),
    shouldRemove: async () => (options.remaining !== null && options.remaining < 1),
    run: async (testContext) => {
      if (options.remaining !== null) {
        options.remaining -= 1;
      }

      if (options.expectation) {
        await options.expectation(testContext);
      }

      return typeof options.result === 'function'
        ? options.result(testContext)
        : options.result;
    },
  } as ActionMock;
};
