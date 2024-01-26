/* eslint-disable max-classes-per-file */
import { hasOne, logger, makeMapRegistryWith, makeModel, normalizeDotRelations } from '@foscia/core';
import { describe, expect, it, vi } from 'vitest';

describe('unit: normalizeDotRelations', () => {
  it('should normalize only roots without registry', async () => {
    const loggerDebugSpy = vi.spyOn(logger, 'debug');

    class SubModel extends makeModel('sub-model', {
      baz: hasOne().alias('foobar'),
    }) {
    }

    const model = makeModel('model', {
      foo: hasOne<SubModel>('sub-model').alias('bar'),
    });

    expect(await normalizeDotRelations(model, ['foo', 'foo.baz']))
      .toStrictEqual(['bar', 'bar.baz']);
    expect(loggerDebugSpy).toHaveBeenCalledOnce();
  });

  it('should normalize all with registry', async () => {
    const loggerDebugSpy = vi.spyOn(logger, 'debug');

    class SubModel extends makeModel('sub-model', {
      baz: hasOne().alias('foobar'),
    }) {
    }

    const model = makeModel('model', {
      foo: hasOne<SubModel>('sub-model').alias('bar'),
    });

    const registry = makeMapRegistryWith({});
    registry.register([model, SubModel]);

    expect(await normalizeDotRelations(model, ['foo', 'foo.baz'], registry))
      .toStrictEqual(['bar', 'bar.foobar']);
    expect(loggerDebugSpy).not.toHaveBeenCalled();
  });

  it('should normalize all with model', async () => {
    const loggerDebugSpy = vi.spyOn(logger, 'debug');

    const subModel = makeModel('sub-model', {
      baz: hasOne().alias('foobar'),
    });
    const model = makeModel('model', {
      foo: hasOne(() => subModel).alias('bar'),
    });

    expect(await normalizeDotRelations(model, ['foo', 'foo.baz']))
      .toStrictEqual(['bar', 'bar.foobar']);
    expect(loggerDebugSpy).not.toHaveBeenCalled();
  });

  it('should warn about non-relations keys', async () => {
    const loggerWarnSpy = vi.spyOn(logger, 'warn');

    const model = makeModel('model', {});

    expect(await normalizeDotRelations(model, ['foo'] as any)).toStrictEqual(['foo']);
    expect(loggerWarnSpy).toHaveBeenCalledOnce();
  });
});
