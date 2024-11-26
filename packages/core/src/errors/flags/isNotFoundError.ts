import { NotFoundErrorI } from '@foscia/core/errors/flags/types';

/**
 * Check if an error should be interpreted by Foscia as a "Record not found"
 * error.
 *
 * @param error
 */
export default (error: unknown): error is NotFoundErrorI => !!error
  && typeof error === 'object'
  && '$FOSCIA_ERROR_NOT_FOUND' in error
  && error.$FOSCIA_ERROR_NOT_FOUND === true;
