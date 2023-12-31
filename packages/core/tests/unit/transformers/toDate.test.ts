import { logger, toDate } from '@foscia/core';
import { describe, expect, it, vi } from 'vitest';

describe.concurrent('unit: toDate', () => {
  it.each([
    [new Date(Date.UTC(2023, 5, 15, 12, 30, 0)), '2023-06-15T12:30:00.000Z'],
  ])('should serialize date to string', (value, expected) => {
    expect(toDate().serialize(value)).toStrictEqual(expected);
    expect(toDate().serialize(value)).toStrictEqual(expected);
  });

  it.each([
    ['2023-06-15T12:30:00.000Z', new Date(Date.UTC(2023, 5, 15, 12, 30, 0))],
  ])('should deserialize string to date', (value, expected) => {
    expect(toDate().deserialize(value)).toStrictEqual(expected);
    expect(toDate().deserialize(value)).toStrictEqual(expected);
  });

  it('should ignore null', () => {
    expect(toDate().deserialize(null)).toBeNull();
    expect(toDate().deserialize(undefined)).toBeNull();
    expect(toDate().serialize(null)).toBeNull();
  });

  it('should warn about NaN values', async () => {
    const loggerWarnMock = vi.spyOn(logger, 'warn').mockImplementation(() => undefined);
    expect((await toDate().deserialize('foo-bar'))!.getTime()).toBeNaN();
    expect(loggerWarnMock.mock.calls).toStrictEqual([
      ['Transformer `toDate` transform resulted in NaN date value.', [{ value: 'foo-bar' }]],
    ]);
    loggerWarnMock.mockRestore();
  });
});
