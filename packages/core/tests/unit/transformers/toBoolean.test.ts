import { toBoolean } from '@foscia/core';
import { describe, expect, it } from 'vitest';

describe.concurrent('unit: toBoolean', () => {
  it.each([
    [true, true],
    [1, true],
    ['1', true],
    ['true', true],
    ['yes', true],
    [false, false],
    [0, false],
    ['0', false],
    ['false', false],
    ['no', false],
  ])('should convert to boolean with default values', (value, expected) => {
    expect(toBoolean().deserialize(value)).toStrictEqual(expected);
    expect(toBoolean().serialize(value as any)).toStrictEqual(expected);
  });

  it.each([
    [true, true],
    [1, true],
    ['1', false],
    ['true', false],
    ['yes', false],
    [false, false],
    [0, false],
    ['0', false],
    ['false', false],
    ['no', false],
  ])('should convert to boolean with custom values', (value, expected) => {
    const customToBoolean = toBoolean({ trueValues: [true, 1] });
    expect(customToBoolean.deserialize(value)).toStrictEqual(expected);
    expect(customToBoolean.serialize(value as any)).toStrictEqual(expected);
  });

  it('should ignore null', () => {
    expect(toBoolean().deserialize(null)).toBeNull();
    expect(toBoolean().deserialize(undefined)).toBeNull();
    expect(toBoolean().serialize(null)).toBeNull();
  });
});
