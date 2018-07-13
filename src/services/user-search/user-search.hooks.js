const { disallow } = require('feathers-hooks-common');
const { hooks } = require('mostly-feathers-mongoose');

module.exports = function (options = {}) {
  return {
    before: {
      all: [
        hooks.authenticate('jwt', options.auth)
      ],
      create: disallow(),
      update: disallow(),
      remove: disallow()
    },
    after: {
      all: [
        hooks.responder()
      ]
    }
  };
};