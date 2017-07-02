import Entity from 'mostly-entity';

const GroupEntity = new Entity('Group');

GroupEntity.excepts('createdAt', 'updatedAt', 'destroyedAt');

export default GroupEntity.asImmutable();
