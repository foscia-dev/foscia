import { isFosciaFlag } from '@foscia/shared';
import { describe, expect, it } from 'vitest';

describe.concurrent('unit: flags', () => {
  it('should ensure object is flagged with flag', () => {
    const fooFlag = 1;
    const barFlag = 2;
    const bazFlag = 4;

    const nonObject = {};
    const nonFlaggedObject = {};
    const flaggedObjectFoo = { $FOSCIA_FLAGS: fooFlag };
    const flaggedObjectBar = { $FOSCIA_FLAGS: barFlag };
    // eslint-disable-next-line no-bitwise
    const flaggedObjectFooBar = { $FOSCIA_FLAGS: fooFlag | barFlag };

    expect(isFosciaFlag(nonObject, fooFlag)).toBe(false);
    expect(isFosciaFlag(nonFlaggedObject, fooFlag)).toBe(false);

    expect(isFosciaFlag(flaggedObjectFoo, fooFlag)).toBe(true);
    expect(isFosciaFlag(flaggedObjectBar, fooFlag)).toBe(false);
    expect(isFosciaFlag(flaggedObjectFooBar, fooFlag)).toBe(true);

    expect(isFosciaFlag(flaggedObjectFoo, barFlag)).toBe(false);
    expect(isFosciaFlag(flaggedObjectBar, barFlag)).toBe(true);
    expect(isFosciaFlag(flaggedObjectFooBar, barFlag)).toBe(true);

    expect(isFosciaFlag(flaggedObjectFoo, bazFlag)).toBe(false);
    expect(isFosciaFlag(flaggedObjectBar, bazFlag)).toBe(false);
    expect(isFosciaFlag(flaggedObjectFooBar, bazFlag)).toBe(false);
  });
});
