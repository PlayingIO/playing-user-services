import Entity from 'mostly-entity';
import fp from 'mostly-func';

const UserEntity = new Entity('User');

UserEntity.expose('displayLabel', {}, (obj) => {
  return obj.nickname || (obj.firstName? obj.firstName + ' ' + obj.lastName : obj.username);
});

UserEntity.discard('_id');

export default UserEntity.freeze();
