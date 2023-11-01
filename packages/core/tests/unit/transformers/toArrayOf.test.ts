import { toArrayOf, toString } from '@foscia/core';
import { describe, expect, it } from 'vitest';

describe.concurrent('unit: toArrayOf', () => {
  it.each([
    [['foo', 'bar'], ['foo', 'bar']],
    [[42, 42.42], ['42', '42.42']],
  ])('should convert items to string', async (value, expected) => {
    const toArrayOfString = toArrayOf(toString());
    expect((await toArrayOfString.deserialize(value))).toStrictEqual(expected);
    expect((await toArrayOfString.serialize(expected))).toStrictEqual(expected);
  });

  it('should ignore null', () => {
    expect(toArrayOf(toString()).deserialize(null)).toBeNull();
    expect(toArrayOf(toString()).deserialize(undefined)).toBeNull();
    expect(toArrayOf(toString()).serialize(null)).toBeNull();
  });
});
