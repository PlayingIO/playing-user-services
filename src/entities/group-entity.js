import Entity from 'mostly-entity';

const GroupEntity = new Entity('Group', {
  type: { default: 'group' },
  displayLabel: { get: 'label' }
});

GroupEntity.excepts('updatedAt', 'destroyedAt');

export default GroupEntity.asImmutable();
