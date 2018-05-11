import Entity from 'mostly-entity';
import fp from 'mostly-func';

const UserEntity = new Entity('User', {
  type: { default: 'user' }
});

UserEntity.expose('displayLabel', {}, (obj) => {
  return obj.nickname || (obj.firstName? obj.firstName + ' ' + obj.lastName : obj.username);
});

// UserEntity.expose('groups', {}, (obj) => {
//   return fp.map(group => group.group || group, obj.groups || []);
// });

UserEntity.excepts('random', 'destroyedAt');

export default UserEntity.asImmutable();
