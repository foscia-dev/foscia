import { ModelRelation } from '@foscia/core/model/types';
import { SYMBOL_MODEL_RELATION_HAS_MANY } from '@foscia/core/symbols';

export default (
  def: ModelRelation,
): boolean => def.$RELATION_TYPE === SYMBOL_MODEL_RELATION_HAS_MANY;
