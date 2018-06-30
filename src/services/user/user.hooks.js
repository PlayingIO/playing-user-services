import local from 'feathers-authentication-local';
import { iff, unless } from 'feathers-hooks-common';
import { hooks } from 'mostly-feathers-mongoose';
import { cache } from 'mostly-feathers-cache';
import { sanitize, validate } from 'mostly-feathers-validate';

import UserEntity from '../../entities/user.entity';
import accepts from './user.accepts';

// discard password except internal call and with params.password specified
const discardPassword = hook => {
  const params = hook.params || {};
  return !(params.password && !params.provider);
};

export default function (options = {}) {
  return {
    before: {
      all: [],
      find: [
        hooks.authenticate('jwt'),
        hooks.idAsCurrentUser('me'),
        sanitize(accepts),
        validate(accepts),
        cache(options.cache)
      ],
      get: [
        hooks.authenticate('jwt'),
        hooks.idAsCurrentUser('me'),
        sanitize(accepts),
        validate(accepts),
        cache(options.cache)
      ],
      create: [
        sanitize(accepts),
        validate(accepts),
        local.hooks.hashPassword()
      ],
      update: [
        hooks.authenticate('jwt'),
        hooks.idAsCurrentUser('me'),
        sanitize(accepts),
        validate(accepts),
        cache(options.cache),
        hooks.discardFields('groups', 'createdAt', 'updatedAt', 'destroyedAt'),
        unless(hooks.isAction('password'), local.hooks.hashPassword())
      ],
      patch: [
        hooks.authenticate('jwt'),
        hooks.idAsCurrentUser('me'),
        sanitize(accepts),
        validate(accepts),
        cache(options.cache),
        hooks.discardFields('groups', 'createdAt', 'updatedAt', 'destroyedAt'),
        unless(hooks.isAction('password'), local.hooks.hashPassword())
      ],
      remove: [
        hooks.authenticate('jwt'),
        hooks.idAsCurrentUser('me'),
        sanitize(accepts),
        validate(accepts),
        cache(options.cache)
      ]
    },
    after: {
      all: [
        iff(discardPassword, hooks.discardFields('password')),
        hooks.populate('groups', { service: 'groups', field: 'groups.group', fallThrough: ['headers'] }),
        hooks.assoc('alerts', { service: 'user-alerts', field: 'user' }),
        hooks.assoc('permissions', { service: 'user-permissions', field: 'user' }),
        hooks.flatMerge('groups.group'),
        cache(options.cache),
        hooks.presentEntity(UserEntity, options.entities),
        hooks.responder()
      ]
    }
  };
}