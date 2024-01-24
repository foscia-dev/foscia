import { logger, toNumber } from '@foscia/core';
import { describe, expect, it, vi } from 'vitest';

describe('unit: toNumber', () => {
  it.concurrent.each([
    [1, 1],
    ['1', 1],
    [1.5, 1.5],
    ['1.5', 1.5],
    [42.42, 42.42],
    ['42.42', 42.42],
  ])('should convert to number', (value, expected) => {
    expect(toNumber().deserialize(value)).toStrictEqual(expected);
    expect(toNumber().serialize(value as any)).toStrictEqual(expected);
  });

  it.concurrent('should ignore null', () => {
    expect(toNumber().deserialize(null)).toBeNull();
    expect(toNumber().deserialize(undefined)).toBeNull();
    expect(toNumber().serialize(null)).toBeNull();
  });

  it.concurrent('should warn about NaN values', () => {
    const loggerWarnMock = vi.spyOn(logger, 'warn').mockImplementation(() => undefined);
    expect(toNumber().deserialize('foo-bar')).toBeNaN();
    expect(loggerWarnMock.mock.calls).toStrictEqual([
      ['Transformer `toNumber` transform resulted in NaN value.', [{ value: 'foo-bar' }]],
    ]);
    loggerWarnMock.mockRestore();
  });
});
