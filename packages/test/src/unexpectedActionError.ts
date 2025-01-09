import FosciaTestError from '@foscia/test/fosciaTestError';
import { ActionTestContext } from '@foscia/test/types';

/**
 * Error which occurs when a mocked action is ran but no mock matching test
 * context could be found to mock the result.
 *
 * @group Errors
 *
 * @internal
 */
export default class UnexpectedActionError extends FosciaTestError {
  public readonly context: ActionTestContext;

  public constructor(context: ActionTestContext) {
    super(
      'Unexpected mocked action run. Either you didn\'t called `mock` on your factory mock or your predicate does not match test context.',
    );

    this.context = context;
  }
}
