import local from 'feathers-authentication-local';
import { iff, isProvider, unless } from 'feathers-hooks-common';
import { hooks } from 'mostly-feathers-mongoose';
import { cacheMap } from 'mostly-utils-common';
import UserEntity from '~/entities/user-entity';

const cache = cacheMap({ max: 100 });

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
        hooks.cache(cache)
      ],
      get: [
        hooks.authenticate('jwt'),
        hooks.idAsCurrentUser('me'),
        hooks.cache(cache)
      ],
      create: [
        local.hooks.hashPassword()
      ],
      update: [
        hooks.authenticate('jwt'),
        hooks.idAsCurrentUser('me'),
        hooks.cache(cache),
        hooks.discardFields('id', 'groups', 'createdAt', 'updatedAt', 'destroyedAt'),
        unless(hooks.isAction('changePassword'), local.hooks.hashPassword())
      ],
      patch: [
        hooks.authenticate('jwt'),
        hooks.idAsCurrentUser('me'),
        hooks.cache(cache),
        hooks.discardFields('id', 'groups', 'createdAt', 'updatedAt', 'destroyedAt'),
        unless(hooks.isAction('changePassword'), local.hooks.hashPassword())
      ],
      remove: [
        hooks.authenticate('jwt'),
        hooks.idAsCurrentUser('me'),
        hooks.cache(cache)
      ]
    },
    after: {
      all: [
        iff(discardPassword, hooks.discardFields('password')),
        hooks.populate('groups.group', { service: 'groups', fallThrough: ['headers'] }),
        hooks.assoc('permissions', { service: 'user-permissions', field: 'user' }),
        hooks.cache(cache),
        hooks.presentEntity(UserEntity, options),
        hooks.responder()
      ]
    }
  };
};