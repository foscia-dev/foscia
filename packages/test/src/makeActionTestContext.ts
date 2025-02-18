import { ActionCall, AnonymousRunner, isEnhancer, isRunner, isWhen } from '@foscia/core';
import { Dictionary } from '@foscia/shared';
import { ActionTestCall, ActionTestContext } from '@foscia/test/types';

export default (
  context: Dictionary<any>,
  calls: ActionCall[],
  runners: AnonymousRunner<any, unknown>[],
) => {
  const makeRunnerCall = (r: AnonymousRunner<any, any>[]): ActionCall => ({
    call: r[0],
    calls: (r.length > 1 ? [makeRunnerCall(r.slice(1))] : []),
  });

  const allCalls = [...calls, makeRunnerCall(runners)];

  const makeTestCall = (call: ActionCall, depth = 0): ActionTestCall => ({
    ...(isEnhancer(call.call) || isRunner(call.call) || isWhen(call.call) ? {
      name: call.call.meta.name,
      args: call.call.meta.args,
    } : {
      name: null,
      args: null,
    }),
    depth,
    calls: call.calls.map((c) => makeTestCall(c, depth + 1)),
    original: call,
  });

  const testCalls = allCalls.map((c) => makeTestCall(c, 0));

  const flattenedTestCalls = [] as ActionTestCall[];
  const appendToFlattenedCalls = (call: ActionTestCall) => {
    flattenedTestCalls.push(call);
    call.calls.forEach(appendToFlattenedCalls);
  };
  testCalls.forEach(appendToFlattenedCalls);

  const makeTestCallPredicate = (
    predicate: ((call: ActionTestCall) => boolean) | string,
  ) => (testCall: ActionTestCall) => (
    typeof predicate === 'string' ? testCall.name === predicate : predicate(testCall)
  );

  const has = (
    predicate: ((call: ActionTestCall) => boolean) | string,
  ) => flattenedTestCalls.some(makeTestCallPredicate(predicate));

  const find = (
    predicate: ((call: ActionTestCall) => boolean) | string,
  ) => {
    const testCall = flattenedTestCalls.find(makeTestCallPredicate(predicate));
    if (!testCall) {
      return null;
    }

    return testCall;
  };

  const args = (
    predicate: ((call: ActionTestCall) => boolean) | string,
  ) => {
    const testCall = find(predicate);
    if (!testCall || testCall.name === null) {
      return [];
    }

    return testCall.args;
  };

  const findAll = (
    predicate: ((call: ActionTestCall) => boolean) | string,
  ) => flattenedTestCalls.filter(makeTestCallPredicate(predicate));

  return {
    context,
    calls: {
      has,
      args,
      find,
      findAll,
      size: () => testCalls.length,
      tree: () => testCalls,
      all: () => flattenedTestCalls,
      originals: () => allCalls,
    },
  } as ActionTestContext;
};
