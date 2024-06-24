import context from '@foscia/core/actions/context/enhancers/context';
import include from '@foscia/core/actions/context/enhancers/include';
import query from '@foscia/core/actions/context/enhancers/query';
import catchIf from '@foscia/core/actions/context/runners/catchIf';
import when from '@foscia/core/actions/when';

export default function coreExtension() {
  return {
    ...query.extension(),
    ...include.extension(),
    ...context.extension(),
    ...when.extension(),
    ...catchIf.extension(),
  };
}
