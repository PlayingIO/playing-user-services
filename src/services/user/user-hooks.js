import { hooks as auth } from 'feathers-authentication';
import local from 'feathers-authentication-local';
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

const currentMe = hook => {
  if (hook.id === 'me' && hook.params.user) {
    hook.id = hook.params.user.id;
  }
  return hook;
};

const isChangePassword = hook => {
  return hook.params.__action === 'changePassword';
};


module.exports = {
  before: {
    all: [
      auth.authenticate('jwt'),
      hooks.validation(accepts),
      currentMe
    ],
    create: [
      local.hooks.hashPassword()
    ],
    update: [
      unless(isChangePassword,
        local.hooks.hashPassword()
      )
    ],
    patch: [
      unless(isChangePassword,
        local.hooks.hashPassword()
      )
    ],
  },
  after: {
    all: [
      //remove('password'),
      hooks.populate('groups', { service: 'groups' }),
      hooks.presentEntity(UserEntity),
      hooks.responder()
    ]
  }
};
