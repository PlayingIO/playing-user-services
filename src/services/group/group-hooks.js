import { hooks } from 'mostly-feathers-mongoose';
import { cache } from 'mostly-feathers-cache';
import GroupEntity from '~/entities/group-entity';

module.exports = function(options = {}) {
  return {
    before: {
      all: [
        hooks.authenticate('jwt', options),
        cache(options.cache)
      ],
      update: [
        hooks.discardFields('id', 'createdAt', 'updatedAt', 'destroyedAt')
      ],
      patch: [
        hooks.discardFields('id', 'createdAt', 'updatedAt', 'destroyedAt')
      ]
    },
    after: {
      all: [
        hooks.assoc('users', { service: 'users', field: 'groups', elemMatch: 'group' }),
        hooks.assoc('permissions', { service: 'user-permissions', field: 'user' }),
        hooks.populate('owner', { service: 'users' }),
        cache(options.cache),
        hooks.presentEntity(GroupEntity, options),
        hooks.responder()
      ]
    }
  };
};