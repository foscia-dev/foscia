import FosciaError from '@foscia/core/errors/fosciaError';

/**
 * Error which occurs during adapter context execution.
 *
 * It should be thrown when encountering ever on a client request
 * misconfiguration or a data source error.
 *
 * @group Errors
 */
export default class AdapterError extends FosciaError {
}
