import FosciaError from '@foscia/core/errors/fosciaError';

/**
 * Error which occurs during deserialization.
 *
 * It should be thrown when encountering a deserializer configuration error
 * or a data source's data format mismatch.
 *
 * @group Errors
 */
export default class DeserializerError extends FosciaError {
}
