/**
 * History item wrapper for ran context over a mocked action.
 *
 * @internal
 */
export default class ActionMockedHistoryItem {
  /**
   * The context which was run.
   */
  public readonly context: any;

  /**
   * ActionMockedHistoryItem constructor.
   *
   * @param context
   */
  public constructor(context: any) {
    this.context = context;
  }
}
