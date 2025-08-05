import { ENTITY_RECORD_PLUGIN } from '@foscia/core/new/entities/plugins/consts';
import { EntityRecordPlugin } from '@foscia/core/new/entities/plugins/types';
import { EntityRecord } from '@foscia/core/new/entities/types';
import identify from '@foscia/core/new/shared/identity/identify';
import makePlugin from '@foscia/core/new/shared/plugins/makePlugin';

export default function makeEntityRecordPlugin<
  Output extends object,
  Input extends EntityRecord = EntityRecord,
>(
  applyPlugin: (input: Input) => void,
  verifyInput?: (value: unknown) => value is Input,
): EntityRecordPlugin<Input, Output> {
  return identify(ENTITY_RECORD_PLUGIN, makePlugin<Input, Output>(applyPlugin, verifyInput));
}
