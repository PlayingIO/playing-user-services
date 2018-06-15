import Entity from 'mostly-entity';

const GroupEntity = new Entity('Group', {
  displayLabel: { get: 'label' }
});

GroupEntity.excepts('_id');

export default GroupEntity.asImmutable();
