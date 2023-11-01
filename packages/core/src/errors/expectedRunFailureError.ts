import FosciaError from '@foscia/core/errors/fosciaError';

/**
 * Error which occurs on "xxxOrFail" runners.
 *
 * It can be handled globally by the underlying application
 * (e.g. to display a 404 Not Found page).
 */
export default class ExpectedRunFailureError extends FosciaError {
}
