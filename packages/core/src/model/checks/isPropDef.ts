import isAttributeDef from '@foscia/core/model/checks/isAttributeDef';
import isIdDef from '@foscia/core/model/checks/isIdDef';
import isRelationDef from '@foscia/core/model/checks/isRelationDef';
import { ModelAttribute, ModelId, ModelRelation } from '@foscia/core/model/types';

export default (
  def: unknown,
): def is ModelId | ModelAttribute | ModelRelation => isIdDef(def)
  || isAttributeDef(def)
  || isRelationDef(def);
