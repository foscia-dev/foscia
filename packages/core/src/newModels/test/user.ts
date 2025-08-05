import makeEntity from '@foscia/core/newModels/makeEntity';
import belongsTo from '@foscia/core/newModels/properties/belongsTo';
import Post from '@foscia/core/newModels/test/post';
import { BelongsTo } from '@foscia/core/newModels/types';

const User = makeEntity(class {
  $type = 'users';

  @belongsTo(() => Post, { foreignKey: 'id' }) post!: BelongsTo<Post, this>;
});

type User = InstanceType<typeof User>;

export default User;
