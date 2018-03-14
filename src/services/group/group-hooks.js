import { hooks as auth } from 'feathers-authentication';
import { hooks } from 'mostly-feathers-mongoose';
import { cacheMap } from 'mostly-utils-common';
import GroupEntity from '~/entities/group-entity';

const cache = cacheMap({ max: 100 });

module.exports = function(options = {}) {
  return {
    before: {
      all: [
        auth.authenticate('jwt'),
        hooks.cache(cache)
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
        hooks.cache(cache),
        hooks.presentEntity(GroupEntity, options),
        hooks.responder()
      ]
    }
  };
};