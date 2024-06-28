import isNil from '@foscia/shared/checks/isNil';
import { Optional } from '@foscia/shared/types';

export default (value: unknown): value is Optional<''> => isNil(value) || value === '';
