import Entity from 'mostly-entity';

const UserEntity = new Entity('User', {
  type: { default: 'user' }
});

UserEntity.excepts('random', 'destroyedAt');

export default UserEntity.asImmutable();
