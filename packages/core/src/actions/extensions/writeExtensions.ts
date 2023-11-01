import create from '@foscia/core/actions/context/enhancers/crud/create';
import destroy from '@foscia/core/actions/context/enhancers/crud/destroy';
import instanceData from '@foscia/core/actions/context/enhancers/crud/instanceData';
import save from '@foscia/core/actions/context/enhancers/crud/save';
import update from '@foscia/core/actions/context/enhancers/crud/update';

export default {
  ...create.extension,
  ...update.extension,
  ...save.extension,
  ...destroy.extension,
  ...instanceData.extension,
};
