import { pluralize } from '@foscia/shared';
import { describe, expect, it } from 'vitest';

describe.concurrent('unit: pluralize', () => {
  it.each([
    ['car', 'cars'],
    ['apple', 'apples'],
    ['bus', 'buses'],
    ['dish', 'dishes'],
    ['leaf', 'leaves'],
    ['knife', 'knives'],
    ['day', 'days'],
    ['donkey', 'donkeys'],
    ['city', 'cities'],
    ['country', 'countries'],
    ['zoo', 'zoos'],
    ['video', 'videos'],
    ['hero', 'heroes'],
    ['potato', 'potatoes'],
  ])('should pluralize word', (value, kebab) => {
    expect(pluralize(value)).toStrictEqual(kebab);
  });
});
