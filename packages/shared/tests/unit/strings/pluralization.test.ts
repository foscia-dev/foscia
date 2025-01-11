import { pluralize, singularize } from '@foscia/shared';
import { describe, expect, it } from 'vitest';

describe.concurrent('unit: pluralization', () => {
  const dataset = [
    // Classic words.
    ['car', 'cars'],
    ['apple', 'apples'],
    ['bus', 'buses'],
    ['dish', 'dishes'],
    ['leaf', 'leaves'],
    ['life', 'lives'],
    ['knife', 'knives'],
    ['day', 'days'],
    ['donkey', 'donkeys'],
    ['city', 'cities'],
    ['country', 'countries'],
    ['zoo', 'zoos'],
    ['video', 'videos'],
    ['hero', 'heroes'],
    ['potato', 'potatoes'],
    // Classic relations.
    ['author', 'authors'],
    ['owner', 'owners'],
    ['post', 'posts'],
    ['user', 'users'],
    ['parent', 'parents'],
    ['child', 'children'],
    ['tag', 'tags'],
    ['category', 'categories'],
    ['product', 'products'],
  ];

  it.each(dataset)('should pluralize word', (singular, plural) => {
    expect(pluralize(singular)).toStrictEqual(plural);
  });

  it.each(dataset)('should singularize word', (singular, plural) => {
    expect(singularize(plural)).toStrictEqual(singular);
  });
});
