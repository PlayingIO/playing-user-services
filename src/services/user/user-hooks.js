import { hooks as auth } from 'feathers-authentication';
import local from 'feathers-authentication-local';
import errors from 'feathers-errors';
import { remove, unless } from 'feathers-hooks-common';
import { hooks } from 'mostly-feathers-mongoose';
import UserEntity from '~/entities/user-entity';

const accepts = {
  changePassword: [
    { arg: 'password', type: 'string', description: 'Old password', required: true },
    { arg: 'passwordNew', type: 'string', description: 'New password', required: true },
    { arg: 'passwordConfirm', type: 'string', description: 'Confirm password', required: true },
  ],
};

const currentMe = options => hook => {
  if (hook.id === 'me' && hook.params.user) {
    if (hook.params.user && hook.params.user.id) {
      hook.id = hook.params.user.id;
    } else {
      throw new errors.GeneralError('authenticate payload is null');
    }
  }
  return hook;
};

const isChangePassword = hook => {
  return hook.params.__action === 'changePassword';
};


module.exports = function(options = {}) {
  return {
    before: {
      all: [
        hooks.validation(accepts),
      ],
      find: [
        auth.authenticate('jwt'),
        currentMe()
      ],
      get: [
        auth.authenticate('jwt'),
        currentMe()
      ],
      create: [
        local.hooks.hashPassword()
      ],
      update: [
        auth.authenticate('jwt'),
        unless(isChangePassword,
          local.hooks.hashPassword()
        )
      ],
      patch: [
        auth.authenticate('jwt'),
        unless(isChangePassword,
          local.hooks.hashPassword()
        )
      ],
      remove: [
        auth.authenticate('jwt'),
        currentMe()
      ]
    },
    after: {
      all: [
        //remove('password'),
        hooks.populate('groups', { service: 'groups' }),
        hooks.presentEntity(UserEntity, options),
        hooks.responder()
      ]
    }
  };
};