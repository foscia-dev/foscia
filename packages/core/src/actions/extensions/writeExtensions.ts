import associate from '@foscia/core/actions/context/enhancers/crud/associate';
import attach from '@foscia/core/actions/context/enhancers/crud/attach';
import create from '@foscia/core/actions/context/enhancers/crud/create';
import destroy from '@foscia/core/actions/context/enhancers/crud/destroy';
import detach from '@foscia/core/actions/context/enhancers/crud/detach';
import dissociate from '@foscia/core/actions/context/enhancers/crud/dissociate';
import instanceData from '@foscia/core/actions/context/enhancers/crud/instanceData';
import relationData from '@foscia/core/actions/context/enhancers/crud/relationData';
import save from '@foscia/core/actions/context/enhancers/crud/save';
import update from '@foscia/core/actions/context/enhancers/crud/update';
import updateRelation from '@foscia/core/actions/context/enhancers/crud/updateRelation';

export default () => ({
  ...create.extension(),
  ...update.extension(),
  ...save.extension(),
  ...destroy.extension(),
  ...instanceData.extension(),
  ...attach.extension(),
  ...detach.extension(),
  ...associate.extension(),
  ...dissociate.extension(),
  ...updateRelation.extension(),
  ...relationData.extension(),
});
