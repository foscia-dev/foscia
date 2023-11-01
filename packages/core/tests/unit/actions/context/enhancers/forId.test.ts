import { forId } from '@foscia/core';
import { describe, expect, it } from 'vitest';
import evaluateContext from '../../../../utils/evaluateContext';

describe.concurrent('unit: forId', () => {
  it('should use id', async () => {
    expect(await evaluateContext(forId('foo'))).toStrictEqual({ id: 'foo' });
  });
});
