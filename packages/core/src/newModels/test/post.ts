/* eslint-disable max-classes-per-file */
import makeComposable from '@foscia/core/newModels/makeComposable';
import makeEntity from '@foscia/core/newModels/makeEntity';
import makeSnapshotPlugin from '@foscia/core/newModels/plugins/snapshots/makeSnapshotPlugin';
import attr from '@foscia/core/newModels/properties/attr';
import belongsTo from '@foscia/core/newModels/properties/belongsTo';
import User from '@foscia/core/newModels/test/user';
import { Attribute, BelongsTo } from '@foscia/core/newModels/types';
import makeDummyPlugin from '@foscia/core/newModels/plugins/snapshots/makeDummyPlugin';

const baseSchema = makeComposable(class {
  readonly $plugins = [];

  @attr() id!: Attribute<string>;
});

const defaultSchema = makeComposable(class {
  readonly $plugins = [makeSnapshotPlugin()];

  @attr() id!: Attribute<string>;
});

const Post = makeEntity(class {
  $type = 'posts';

  $plugins = [defaultSchema, makeDummyPlugin()];

  @attr() title!: Attribute<string>;

  @belongsTo(() => User, { foreignKey: 'post' }) user!: BelongsTo<User, this>;
});

type Post = InstanceType<typeof Post>;

type Test = typeof Post['schema']['test'];

console.log(Post.schema.id);
console.log(Post.schema.title);
console.log(Post.schema.$plugins[0]);
console.log(Post.make().$original.values.title);

export default Post;
