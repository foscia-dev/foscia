import context from '@foscia/core/actions/context/enhancers/context';
import find from '@foscia/core/actions/context/enhancers/crud/find';
import forId from '@foscia/core/actions/context/enhancers/forId';
import forInstance from '@foscia/core/actions/context/enhancers/forInstance';
import forModel from '@foscia/core/actions/context/enhancers/forModel';
import forRelation from '@foscia/core/actions/context/enhancers/forRelation';
import include from '@foscia/core/actions/context/enhancers/include';
import catchIf from '@foscia/core/actions/context/runners/catchIf';
import when from '@foscia/core/actions/when';

export default {
  ...forModel.extension,
  ...forInstance.extension,
  ...forRelation.extension,
  ...forId.extension,
  ...find.extension,
  ...include.extension,
  ...context.extension,
  ...when.extension,
  ...catchIf.extension,
};
