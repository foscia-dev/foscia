import makeContextFunctionFactory from '@foscia/core/actions/utilities/makeContextFunctionFactory';
import { SYMBOL_ACTION_RUNNER } from '@foscia/core/symbols';

/**
 * Make a context runner factory with incorporated metadata (name, arguments).
 *
 * @param name
 * @param factory
 *
 * @category Factories
 */
export default /* @__PURE__ */ makeContextFunctionFactory(SYMBOL_ACTION_RUNNER);
