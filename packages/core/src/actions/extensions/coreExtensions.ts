import context from '@foscia/core/actions/context/enhancers/context';
import include from '@foscia/core/actions/context/enhancers/include';
import query from '@foscia/core/actions/context/enhancers/query';
import queryAs from '@foscia/core/actions/context/enhancers/queryAs';
import catchIf from '@foscia/core/actions/context/runners/catchIf';
import when from '@foscia/core/actions/when';

export default () => ({
  ...query.extension(),
  ...queryAs.extension(),
  ...include.extension(),
  ...context.extension(),
  ...when.extension(),
  ...catchIf.extension(),
});
