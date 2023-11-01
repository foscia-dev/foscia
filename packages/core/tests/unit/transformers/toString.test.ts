import { toString } from '@foscia/core';
import { describe, expect, it } from 'vitest';

describe.concurrent('unit: toString', () => {
  it.each([
    ['hello', 'hello'],
    [42, '42'],
    [42.42, '42.42'],
    [false, 'false'],
  ])('should convert to string', (value, expected) => {
    expect(toString().deserialize(value)).toStrictEqual(expected);
    expect(toString().serialize(value as any)).toStrictEqual(expected);
  });

  it('should ignore null', () => {
    expect(toString().deserialize(null)).toBeNull();
    expect(toString().deserialize(undefined)).toBeNull();
    expect(toString().serialize(null)).toBeNull();
  });
});
