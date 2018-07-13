const local = require('feathers-authentication-local');
const { iff, unless } = require('feathers-hooks-common');
const { hooks } = require('mostly-feathers-mongoose');
const { cache } = require('mostly-feathers-cache');
const { sanitize, validate } = require('mostly-feathers-validate');

const UserEntity = require('../../entities/user.entity');
const accepts = require('./user.accepts');

// discard password except internal call and with params.password specified
const discardPassword = hook => {
  const params = hook.params || {};
  return !(params.password && !params.provider);
};

module.exports = function (options = {}) {
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
};