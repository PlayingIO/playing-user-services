import { disallow } from 'feathers-hooks-common';
import { hooks as auth } from 'feathers-authentication';
import { hooks } from 'mostly-feathers-mongoose';
import { cacheMap } from 'mostly-utils-common';
import PermissionEntity from '~/entities/user-permission-entity';

const cache = cacheMap({ max: 100 });

module.exports = function(options = {}) {
  return {
    before: {
      all: [
        auth.authenticate('jwt'),
        hooks.cache(cache)
      ],
      create: [
        disallow('external'),
      ],
      update: [
        disallow('external'),
        hooks.discardFields('id', 'createdAt', 'updatedAt')
      ],
      patch: [
        disallow('external'),
        hooks.discardFields('id', 'createdAt', 'updatedAt')
      ],
      remove: [
        disallow('external')
      ]
    },
    after: {
      all: [
        hooks.populate('creator', { service: 'users' }),
        hooks.populate('subject', { keepOrig: true }), // typed id
        hooks.populate('user', { service: 'user-groups' }),
        hooks.cache(cache),
        hooks.presentEntity(PermissionEntity, options),
        hooks.responder()
      ]
    }
  };
};