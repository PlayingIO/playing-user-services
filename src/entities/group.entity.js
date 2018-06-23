import Entity from 'mostly-entity';

const GroupEntity = new Entity('Group', {
  displayLabel: { get: 'label' }
});

GroupEntity.discard('_id');

export default GroupEntity.freeze();
