import { SerializerError } from '@foscia/core';

/**
 * Error which occurs on circular relation detection during serialization.
 */
export default class SerializerCircularRelationError extends SerializerError {
}
