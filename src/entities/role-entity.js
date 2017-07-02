import Entity from 'mostly-entity';

const RoleEntity = new Entity('Role');

RoleEntity.excepts('createdAt', 'updatedAt', 'destroyedAt');

export default RoleEntity.asImmutable();