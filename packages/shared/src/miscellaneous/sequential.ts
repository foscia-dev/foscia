import { Awaitable } from '@foscia/shared/types';

/**
 * Execute async callbacks sequentially.
 *
 * @param callbacks
 *
 * @internal
 */
export default function sequential(callbacks: (() => Awaitable<unknown>)[]) {
  return callbacks.reduce(async (prev, callback) => {
    await prev;

    return callback();
  }, Promise.resolve<unknown>(undefined));
}
