import { disallow } from 'feathers-hooks-common';
import { hooks } from 'mostly-feathers-mongoose';

export default function (options = {}) {
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
}