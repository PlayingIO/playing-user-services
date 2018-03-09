import { hooks as auth } from 'feathers-authentication';
import { disallow } from 'feathers-hooks-common';
import { hooks } from 'mostly-feathers-mongoose';

module.exports = function(options = {}) {
  return {
    before: {
      all: [
        auth.authenticate('jwt')
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