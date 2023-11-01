import { FosciaError } from '@foscia/core';

/**
 * Error which occurs when a mock action is ran but no mocked result were
 * defined on the mock or their predicates does not match executed context.
 */
export default class UnexpectedMockedRunError extends FosciaError {
  public readonly context: any;

  public constructor(context: any) {
    super(
      'Unexpected mocked action run. Either you didn\'t called `mockResult` methods or your predicate does not match ran context.',
    );

    this.context = context;
  }
}
