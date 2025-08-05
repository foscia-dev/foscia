import makeComposable from '@foscia/core/newModels/makeComposable';
import attr from '@foscia/core/newModels/properties/attr';
import { Attribute } from '@foscia/core/newModels/types';

export default makeComposable(class {
  @attr() publishedAt!: Attribute<Date>;
});
