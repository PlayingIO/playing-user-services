import Entity from 'mostly-entity';

const UserEntity = new Entity('User');

UserEntity.excepts('random', 'destroyedAt');

export default UserEntity.asImmutable();
