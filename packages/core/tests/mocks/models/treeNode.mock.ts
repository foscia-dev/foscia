import { attr, belongsTo, hasMany, makeModel } from '@foscia/core';

export default class TreeNodeMock extends makeModel('tree-nodes', {
  parent: belongsTo('tree-nodes'),
  parentId: attr<string>(),
  children: hasMany('tree-nodes'),
}) {
}
