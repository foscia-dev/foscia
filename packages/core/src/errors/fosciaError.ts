/**
 * Extendable error class used inside Foscia.
 */
export default class FosciaError extends Error {
  /**
   * Construct a new FosciaError. Prefix the given message with "[foscia]".
   *
   * @param message
   */
  public constructor(message: string) {
    super(`[foscia] ${message}`);

    Object.defineProperty(this, 'name', {
      value: new.target.name,
      enumerable: false,
      configurable: true,
    });

    Object.setPrototypeOf(this, new.target.prototype);

    const { captureStackTrace } = (Error as any);
    if (captureStackTrace) {
      captureStackTrace(this, this.constructor);
    }
  }
}
