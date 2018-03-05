import { hooks as auth } from 'feathers-authentication';
import local from 'feathers-authentication-local';
import { iff, isProvider, unless } from 'feathers-hooks-common';
import { hooks } from 'mostly-feathers-mongoose';
import UserEntity from '~/entities/user-entity';

const accepts = {
  changePassword: [
    { arg: 'password', type: 'string', description: 'Old password', required: true },
    { arg: 'passwordNew', type: 'string', description: 'New password', required: true },
    { arg: 'passwordConfirm', type: 'string', description: 'Confirm password', required: true },
  ],
};

// TODO discard password except self account
const discardPassword = () => hook => {

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
        local.hooks.hashPassword()
      ],
      update: [
        auth.authenticate('jwt'),
        hooks.idAsCurrentUser('me'),
        hooks.discardFields('id', 'groups', 'createdAt', 'updatedAt', 'destroyedAt'),
        unless(hooks.isAction('changePassword'), local.hooks.hashPassword())
      ],
      patch: [
        auth.authenticate('jwt'),
        hooks.idAsCurrentUser('me'),
        hooks.discardFields('id', 'groups', 'createdAt', 'updatedAt', 'destroyedAt'),
        unless(hooks.isAction('changePassword'), local.hooks.hashPassword())
      ],
      remove: [
        auth.authenticate('jwt'),
        hooks.idAsCurrentUser('me')
      ]
    },
    after: {
      all: [
        iff(isProvider('external'), hooks.discardFields('password')),
        hooks.populate('groups.group', { service: 'groups', fallThrough: ['headers'] }),
        hooks.presentEntity(UserEntity, options),
        hooks.responder()
      ]
    }
  };
};