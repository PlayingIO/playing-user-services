import Entity from 'mostly-entity';

const GroupEntity = new Entity('Group');

GroupEntity.excepts('updatedAt', 'destroyedAt');

export default GroupEntity.asImmutable();
