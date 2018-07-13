const { hooks } = require('mostly-feathers-mongoose');
const { cache } = require('mostly-feathers-cache');

module.exports = function (options = {}) {
  return {
    before: {
      all: [
        hooks.authenticate('jwt', options.auth),
        cache(options.cache)
      ],
      create: [
        hooks.addRouteObject('primary', { service: 'users' })
      ],
      patch: [
        hooks.addRouteObject('primary', { service: 'users' })
      ],
      remove: [
        hooks.addRouteObject('primary', { service: 'users' })
      ]
    },
    after: {
      all: [
        cache(options.cache),
        hooks.responder()
      ]
    }
  };
};