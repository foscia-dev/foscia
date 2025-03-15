import { configuration } from '@foscia/core';
import { afterEach } from 'vitest';

afterEach(() => {
  Object.keys(configuration).forEach((key) => {
    delete configuration[key as keyof typeof configuration];
  });
});
