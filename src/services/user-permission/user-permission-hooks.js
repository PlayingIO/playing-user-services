import { disallow } from 'feathers-hooks-common';
import { hooks as auth } from 'feathers-authentication';
import { hooks } from 'mostly-feathers-mongoose';
import PermissionEntity from '~/entities/user-permission-entity';

module.exports = function(options = {}) {
  return {
    before: {
      all: [
        auth.authenticate('jwt')
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
        hooks.presentEntity(PermissionEntity, options),
        hooks.responder()
      ]
    }
  };
};