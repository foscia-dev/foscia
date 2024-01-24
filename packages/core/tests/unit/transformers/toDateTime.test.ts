import { logger, toDateTime } from '@foscia/core';
import { describe, expect, it, vi } from 'vitest';

describe('unit: toDateTime', () => {
  it.concurrent.each([
    [new Date(2023, 5, 15, 12, 30, 0), '2023-06-15T12:30:00.000Z'],
  ])('should serialize date and time to string', (value, expected) => {
    expect(toDateTime().serialize(value)).toStrictEqual(expected);
    expect(toDateTime().serialize(value)).toStrictEqual(expected);
  });

  it.concurrent.each([
    ['2023-06-15T12:30:00.000Z', new Date(2023, 5, 15, 12, 30, 0)],
  ])('should deserialize string to date and time', (value, expected) => {
    expect(toDateTime().deserialize(value)).toStrictEqual(expected);
    expect(toDateTime().deserialize(value)).toStrictEqual(expected);
  });

  it.concurrent('should ignore null', () => {
    expect(toDateTime().deserialize(null)).toBeNull();
    expect(toDateTime().deserialize(undefined)).toBeNull();
    expect(toDateTime().serialize(null)).toBeNull();
  });

  it('should warn about NaN values', async () => {
    const loggerWarnMock = vi.spyOn(logger, 'warn').mockImplementation(() => undefined);
    expect((await toDateTime().deserialize('foo-bar'))!.getTime()).toBeNaN();
    expect(loggerWarnMock.mock.calls).toStrictEqual([
      ['Transformer `toDateTime` transform resulted in NaN date value.', [{ value: 'foo-bar' }]],
    ]);
    loggerWarnMock.mockRestore();
  });
});
