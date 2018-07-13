const Entity = require('mostly-entity');
const fp = require('mostly-func');

const UserEntity = new Entity('User');

UserEntity.expose('displayLabel', {}, (obj) => {
  return obj.nickname || (obj.firstName? obj.firstName + ' ' + obj.lastName : obj.username);
});

UserEntity.discard('_id');

module.exports = UserEntity.freeze();
