import Entity from 'mostly-entity';

const UserEntity = new Entity('User', {
  type: { default: 'user' }
});

UserEntity.expose('displayLabel', {}, (obj) => {
  return obj.nickname || (obj.firstName? obj.firstName + ' ' + obj.lastName : obj.username);
});

UserEntity.excepts('random', 'destroyedAt');

export default UserEntity.asImmutable();
