import FosciaError from '@foscia/core/errors/fosciaError';

/**
 * Error which occurs on {@link oneOrFail | `oneOrFail`}
 * or {@link cachedOrFail | `cachedOrFail`} runners when a record
 * cannot be found or deserialized.
 *
 * It can be handled globally by the underlying application
 * (e.g. to display a 404 Not Found page).
 *
 * @group Errors
 */
export default class RecordNotFoundError extends FosciaError {
}
