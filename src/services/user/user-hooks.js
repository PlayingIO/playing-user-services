import local from 'feathers-authentication-local';
import { iff, isProvider, unless } from 'feathers-hooks-common';
import { hooks } from 'mostly-feathers-mongoose';
import { cache } from 'mostly-feathers-cache';
import UserEntity from '~/entities/user-entity';

const accepts = {
  changePassword: [
    { arg: 'password', type: 'string', description: 'Old password', required: true },
    { arg: 'passwordNew', type: 'string', description: 'New password', required: true },
    { arg: 'passwordConfirm', type: 'string', description: 'Confirm password', required: true },
  ],
};

// discard password except internal call and with params.password specified
const discardPassword = hook => {
  const params = hook.params || {};
  return !(params.password && !params.provider);
};

module.exports = function(options = {}) {
  return {
    before: {
      all: [
        hooks.validation(accepts)
      ],
      find: [
        hooks.authenticate('jwt'),
        hooks.idAsCurrentUser('me'),
        cache(options.cache)
      ],
      get: [
        hooks.authenticate('jwt'),
        hooks.idAsCurrentUser('me'),
        cache(options.cache)
      ],
      create: [
        local.hooks.hashPassword()
      ],
      update: [
        hooks.authenticate('jwt'),
        hooks.idAsCurrentUser('me'),
        cache(options.cache),
        hooks.discardFields('id', 'groups', 'createdAt', 'updatedAt', 'destroyedAt'),
        unless(hooks.isAction('changePassword'), local.hooks.hashPassword())
      ],
      patch: [
        hooks.authenticate('jwt'),
        hooks.idAsCurrentUser('me'),
        cache(options.cache),
        hooks.discardFields('id', 'groups', 'createdAt', 'updatedAt', 'destroyedAt'),
        unless(hooks.isAction('changePassword'), local.hooks.hashPassword())
      ],
      remove: [
        hooks.authenticate('jwt'),
        hooks.idAsCurrentUser('me'),
        cache(options.cache)
      ]
    },
    after: {
      all: [
        iff(discardPassword, hooks.discardFields('password')),
        hooks.populate('groups.group', { service: 'groups', fallThrough: ['headers'] }),
        hooks.assoc('permissions', { service: 'user-permissions', field: 'user' }),
        cache(options.cache),
        hooks.presentEntity(UserEntity, options),
        hooks.responder()
      ]
    }
  };
};