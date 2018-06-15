import Entity from 'mostly-entity';
import fp from 'mostly-func';

const UserEntity = new Entity('User');

UserEntity.expose('displayLabel', {}, (obj) => {
  return obj.nickname || (obj.firstName? obj.firstName + ' ' + obj.lastName : obj.username);
});

UserEntity.excepts('_id');

export default UserEntity.asImmutable();
