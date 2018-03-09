import { hooks as auth } from 'feathers-authentication';
import { hooks } from 'mostly-feathers-mongoose';
import PermissionEntity from '~/entities/user-permission-entity';

module.exports = function(options = {}) {
  return {
    before: {
      all: [
        auth.authenticate('jwt')
      ],
      update: [
        hooks.discardFields('id', 'createdAt', 'updatedAt')
      ],
      patch: [
        hooks.discardFields('id', 'createdAt', 'updatedAt')
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