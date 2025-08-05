import makeEntity from '@foscia/core/new/entities/makeEntity';
import attr from '@foscia/core/new/entities/properties/attr';
import belongsTo from '@foscia/core/new/entities/properties/belongsTo';
import { Attribute, BelongsTo, Foreign, Primary } from '@foscia/core/new/entities/properties/types';
import { EntityRecordOf } from '@foscia/core/new/entities/types';
import Post from '@foscia/core/new/test/post';

const User = makeEntity(class {
  $type = 'users';

  @attr()
  id!: Primary<string>;

  @attr()
  email!: Attribute<string>;

  @belongsTo(() => Post, { ownerKey: 'id', foreignKey: 'authorId' })
  post!: BelongsTo<Post>;

  @attr()
  managerId!: Foreign<User, 'id'>;

  @belongsTo(() => 'self', { ownerKey: 'id', foreignKey: 'managerId' })
  manager!: BelongsTo<User>;
});

type User = EntityRecordOf<typeof User>;

export default User;
