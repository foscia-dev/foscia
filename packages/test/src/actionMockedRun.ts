import { ActionMockedRunOptions } from '@foscia/test/types';

/**
 * Mocked action run configuration for mocked action factory.
 */
export default class ActionMockedRun<C extends {} = any> {
  /**
   * The options to use when checking and running.
   */
  private readonly options: ActionMockedRunOptions<C>;

  /**
   * The remaining mocked ran before forgetting it.
   */
  private remaining: number | null;

  /**
   * ActionMockedRun constructor.
   *
   * @param options
   */
  public constructor(options: ActionMockedRunOptions<C>) {
    this.options = options;
    this.remaining = options.times ?? null;
  }

  /**
   * Check if mocked run should run (predicates match).
   *
   * @param context
   */
  public async shouldRun(context: C) {
    return this.options.predicate
      ? (await this.options.predicate(context)) ?? true
      : true;
  }

  /**
   * Check if mocked run should be forgotten (when no remaining ran).
   */
  public async shouldForget() {
    return this.remaining !== null && this.remaining < 1;
  }

  /**
   * Run the mocked run and return result.
   *
   * @param context
   */
  public async run(context: C) {
    if (this.remaining !== null) {
      this.remaining -= 1;
    }

    if (this.options.expectation) {
      await this.options.expectation(context);
    }

    return typeof this.options.result === 'function'
      ? this.options.result(context)
      : this.options.result;
  }
}
