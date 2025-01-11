import { camelCase, kebabCase } from '@foscia/shared';
import { describe, expect, it } from 'vitest';

describe.concurrent('unit: case', () => {
  it.each([
    ['', ''],
    ['foo', 'foo'],
    ['foo-bar', 'foo-bar'],
    ['foo_bar', 'foo-bar'],
    ['foo bar', 'foo-bar'],
    ['Foo Bar', 'foo-bar'],
    ['FOO BAR', 'foo-bar'],
  ])('should convert to kebab case', (value, kebab) => {
    expect(kebabCase(value)).toStrictEqual(kebab);
  });

  it.each([
    ['', ''],
    ['foo', 'foo'],
    ['foo-bar', 'fooBar'],
    ['foo_bar', 'fooBar'],
    ['foo bar', 'fooBar'],
    ['Foo Bar', 'fooBar'],
    ['FOO BAR', 'fooBar'],
  ])('should convert to camel case', (value, kebab) => {
    expect(camelCase(value)).toStrictEqual(kebab);
  });
});
