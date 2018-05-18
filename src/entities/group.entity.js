import Entity from 'mostly-entity';

const GroupEntity = new Entity('Group', {
  displayLabel: { get: 'label' }
});

GroupEntity.excepts('updatedAt', 'destroyedAt');

export default GroupEntity.asImmutable();
