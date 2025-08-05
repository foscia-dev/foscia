import makeSnapshotPlugin from '@foscia/core/newModels/plugins/snapshots/makeSnapshotPlugin';
import attr from '@foscia/core/newModels/properties/attr';
import { Attribute } from '@foscia/core/newModels/types';

export default class {
  readonly $plugins = [makeSnapshotPlugin()];

  @attr() id!: Attribute<string>;
}
