/**
 * Common and standardized actions that can be run using Foscia.
 *
 * @internal
 */
enum ActionKind {
  READ = 'read',
  CREATE = 'create',
  UPDATE = 'update',
  DESTROY = 'destroy',
  ATTACH_RELATION = 'attachRelation',
  UPDATE_RELATION = 'updateRelation',
  DETACH_RELATION = 'detachRelation',
}

export default ActionKind;
