import { toKebabCase } from '@foscia/shared';
import { describe, expect, it } from 'vitest';

describe.concurrent('unit: toKebabCase', () => {
  it.each([
    ['', ''],
    ['foo', 'foo'],
    ['foo-bar', 'foo-bar'],
    ['foo_bar', 'foo-bar'],
    ['foo bar', 'foo-bar'],
    ['Foo Bar', 'foo-bar'],
    ['FOO BAR', 'foo-bar'],
  ])('should convert to kebab case', (value, kebab) => {
    expect(toKebabCase(value)).toStrictEqual(kebab);
  });
});
