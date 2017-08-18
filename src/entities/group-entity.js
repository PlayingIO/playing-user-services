import Entity from 'mostly-entity';

const GroupEntity = new Entity('Group', {
  type: { default: 'group' }
});

GroupEntity.excepts('updatedAt', 'destroyedAt');

export default GroupEntity.asImmutable();
