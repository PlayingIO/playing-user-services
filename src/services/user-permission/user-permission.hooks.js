const { disallow } = require('feathers-hooks-common');
const { hooks } = require('mostly-feathers-mongoose');
const { cache } = require('mostly-feathers-cache');

const PermissionEntity = require('../../entities/user-permission.entity');

module.exports = function (options = {}) {
  return {
    before: {
      all: [
        hooks.authenticate('jwt', options.auth),
        cache(options.cache)
      ],
      create: [
        disallow('external'),
      ],
      update: [
        disallow('external'),
        hooks.discardFields('createdAt', 'updatedAt')
      ],
      patch: [
        disallow('external'),
        hooks.discardFields('createdAt', 'updatedAt')
      ],
      remove: [
        disallow('external')
      ]
    },
    after: {
      all: [
        hooks.populate('creator', { service: 'users' }),
        hooks.populate('subject', { keepOrig: true }), // typed id
        hooks.populate('user', { service: 'user-searches' }),
        cache(options.cache),
        hooks.presentEntity(PermissionEntity, options.entities),
        hooks.responder()
      ]
    }
  };
};