export default class CLIError extends Error {
  public constructor(message: string) {
    super(message);

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
