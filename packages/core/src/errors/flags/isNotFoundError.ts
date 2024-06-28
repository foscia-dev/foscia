import { NotFoundErrorI } from '@foscia/core/errors/flags/types';

export default (error: unknown): error is NotFoundErrorI => !!error
  && typeof error === 'object'
  && '$FOSCIA_ERROR_NOT_FOUND' in error
  && error.$FOSCIA_ERROR_NOT_FOUND === true;
