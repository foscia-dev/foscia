import { logger } from '@foscia/core';
import { describe, expect, it, vi } from 'vitest';

describe.concurrent('unit: logger', () => {
  it('should only mock when required', () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const infoSpy = vi.spyOn(console, 'info').mockImplementation(() => undefined);
    const debugSpy = vi.spyOn(console, 'debug').mockImplementation(() => undefined);

    logger.level = null;
    logger.error('test error', ['error event']);
    logger.warn('test warn', ['warn event']);
    logger.info('test info', ['info event']);
    logger.debug('test debug', ['debug event']);

    expect(errorSpy).not.toHaveBeenCalled();
    expect(warnSpy).not.toHaveBeenCalled();
    expect(infoSpy).not.toHaveBeenCalled();
    expect(debugSpy).not.toHaveBeenCalled();

    logger.level = 'warn';
    logger.error('test error', ['error event']);
    logger.warn('test warn', ['warn event']);
    logger.info('test info', ['info event']);
    logger.debug('test debug', ['debug event']);

    expect(errorSpy.mock.calls).toStrictEqual([['[foscia] error: test error', 'error event']]);
    expect(warnSpy.mock.calls).toStrictEqual([['[foscia] warn: test warn', 'warn event']]);
    expect(infoSpy).not.toHaveBeenCalled();
    expect(debugSpy).not.toHaveBeenCalled();

    logger.level = 'debug';
    logger.error('test error', ['error event']);
    logger.warn('test warn', ['warn event']);
    logger.info('test info', ['info event']);
    logger.debug('test debug', ['debug event']);

    expect(errorSpy).toHaveBeenCalledTimes(2);
    expect(warnSpy).toHaveBeenCalledTimes(2);
    expect(infoSpy.mock.calls).toStrictEqual([['[foscia] info: test info', 'info event']]);
    expect(debugSpy.mock.calls).toStrictEqual([['[foscia] debug: test debug', 'debug event']]);

    errorSpy.mockRestore();
    warnSpy.mockRestore();
    infoSpy.mockRestore();
    debugSpy.mockRestore();
  });
});
