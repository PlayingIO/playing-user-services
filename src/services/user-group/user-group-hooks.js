import { disallow } from 'feathers-hooks-common';
import { hooks } from 'mostly-feathers-mongoose';

module.exports = function(options = {}) {
  return {
    before: {
      all: [
        hooks.authenticate('jwt', options)
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