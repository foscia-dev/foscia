import makeEntity from '@foscia/core/new/entities/makeEntity';
import attributesPlugin from '@foscia/core/new/entities/plugins/attributesPlugin';
import attr from '@foscia/core/new/entities/properties/attr';
import belongsTo from '@foscia/core/new/entities/properties/belongsTo';
import { BelongsTo } from '@foscia/core/new/entities/properties/types';
import { EntityRecordOf, EntitySchema } from '@foscia/core/new/entities/types';
import User from '@foscia/core/new/test/user';

const Post = makeEntity(class implements EntitySchema {
  $type = 'posts';

  $plugins = [attributesPlugin()];

  @attr()
  id!: string;

  @belongsTo(() => User)
  author!: BelongsTo<User>;

  @attr()
  authorId!: string;
});

type Post = EntityRecordOf<typeof Post>;

export default Post;
