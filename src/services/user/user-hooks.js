import { hooks as auth } from 'feathers-authentication';
import local from 'feathers-authentication-local';
import { iff, isProvider, discard, unless } from 'feathers-hooks-common';
import { hooks } from 'mostly-feathers-mongoose';
import UserEntity from '~/entities/user-entity';

const accepts = {
  changePassword: [
    { arg: 'password', type: 'string', description: 'Old password', required: true },
    { arg: 'passwordNew', type: 'string', description: 'New password', required: true },
    { arg: 'passwordConfirm', type: 'string', description: 'Confirm password', required: true },
  ],
};

module.exports = function(options = {}) {
  return {
    before: {
      all: [
        hooks.validation(accepts),
      ],
      find: [
        auth.authenticate('jwt'),
        hooks.idAsCurrentUser('me')
      ],
      get: [
        auth.authenticate('jwt'),
        hooks.idAsCurrentUser('me')
      ],
      create: [
        hooks.depopulate('groups'),
        local.hooks.hashPassword()
      ],
      update: [
        auth.authenticate('jwt'),
        hooks.idAsCurrentUser('me'),
        hooks.depopulate('groups'),
        unless(hooks.isAction('changePassword'), local.hooks.hashPassword())
      ],
      patch: [
        auth.authenticate('jwt'),
        hooks.idAsCurrentUser('me'),
        hooks.depopulate('groups'),
        unless(hooks.isAction('changePassword'), local.hooks.hashPassword())
      ],
      remove: [
        auth.authenticate('jwt'),
        hooks.idAsCurrentUser('me')
      ]
    },
    after: {
      all: [
        iff(isProvider('external'), discard('password')),
        hooks.populate('groups', { service: 'groups' }),
        hooks.presentEntity(UserEntity, options),
        hooks.responder()
      ]
    }
  };
};