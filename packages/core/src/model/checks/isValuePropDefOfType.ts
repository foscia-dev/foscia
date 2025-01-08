import { ModelAttribute, ModelId, ModelRelation } from '@foscia/core/model/types';
import { SYMBOL_MODEL_PROP } from '@foscia/core/symbols';
import { isFosciaType } from '@foscia/shared';

export default <P extends ModelId<any> | ModelAttribute<any> | ModelRelation<any>>(
  def: unknown,
  propType: P['$VALUE_PROP_TYPE'],
): def is P => isFosciaType(def, SYMBOL_MODEL_PROP)
  && '$VALUE_PROP_TYPE' in def
  && def.$VALUE_PROP_TYPE === propType;
