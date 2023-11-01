import FosciaError from '@foscia/core/errors/fosciaError';

/**
 * Error which occurs during serialization.
 *
 * It should be thrown when encountering a serializer configuration error
 * or a data source's data format mismatch.
 */
export default class SerializerError extends FosciaError {
}
