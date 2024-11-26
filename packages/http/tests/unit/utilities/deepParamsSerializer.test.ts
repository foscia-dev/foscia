import { deepParamsSerializer } from '@foscia/http';
import { describe, expect, it } from 'vitest';

describe.concurrent('unit: deepParamsSerializer', () => {
  it.each([
    [{}, undefined],
    [
      { search: 'foo' },
      'search=foo',
    ],
    [
      { search: 'foo', sort: 'bar' },
      'search=foo&sort=bar',
    ],
    [
      { search: 'foo', sort: 'bar', filter: { foo: 'foo', bar: 'bar' } },
      'search=foo&sort=bar&filter%5Bfoo%5D=foo&filter%5Bbar%5D=bar',
    ],
  ])('should deeply serialize query params', async (params, expected) => {
    expect(deepParamsSerializer(params)).toStrictEqual(expected);
  });
});
