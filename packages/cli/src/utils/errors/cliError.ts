export default class CLIError extends Error {
  public readonly instruction: string | undefined;

  public constructor(message: string, instruction?: string) {
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

    this.instruction = instruction;
  }
}
