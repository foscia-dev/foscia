import { clearEndpoint } from '@foscia/http';
import { describe, expect, it } from 'vitest';

describe.concurrent('unit: clearEndpoint', () => {
  it.each([
    ['', ''],
    ['/api/posts', '/api/posts'],
    ['/api/posts/1', '/api/posts/1'],
    // Leaves ending slashes.
    ['/api/posts/1/', '/api/posts/1/'],
    // Leaves multiple ending slashes.
    ['/api/posts/1//', '/api/posts/1/'],
    // Removes multiple starting slashes.
    ['///api/posts/1', '/api/posts/1'],
    // Leaves multiple scheme slashes.
    ['https://example.com/api/posts/1', 'https://example.com/api/posts/1'],
    // Removes multiple inner slashes.
    ['/api//posts///1', '/api/posts/1'],
    ['/api//posts///1/', '/api/posts/1/'],
  ])('should clear endpoint', async (endpoint, expected) => {
    expect(clearEndpoint(endpoint)).toStrictEqual(expected);
  });
});
