import FosciaError from '@foscia/core/errors/fosciaError';

/**
 * Invalid context error.
 *
 * It should be thrown when trying to access an action context which isn't
 * available when it should be and is required by in-use enhancer/runner.
 */
export default class InvalidContextError extends FosciaError {
}
