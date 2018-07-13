const { hooks } = require('mostly-feathers-mongoose');
const { cache } = require('mostly-feathers-cache');

const GroupEntity = require('../../entities/group.entity');

module.exports = function (options = {}) {
  return {
    before: {
      all: [
        hooks.authenticate('jwt', options.auth),
        cache(options.cache)
      ],
      update: [
        hooks.discardFields('createdAt', 'updatedAt', 'destroyedAt')
      ],
      patch: [
        hooks.discardFields('createdAt', 'updatedAt', 'destroyedAt')
      ]
    },
    after: {
      all: [
        hooks.assoc('members', { service: 'users', field: 'groups', elemMatch: 'group' }),
        hooks.assoc('permissions', { service: 'user-permissions', field: 'user' }),
        hooks.populate('owner', { service: 'users' }),
        cache(options.cache),
        hooks.presentEntity(GroupEntity, options.entities),
        hooks.responder()
      ]
    }
  };
};