import { disallow } from 'feathers-hooks-common';
import { hooks } from 'mostly-feathers-mongoose';
import { cache } from 'mostly-feathers-cache';

import PermissionEntity from '../../entities/user-permission.entity';

export default function (options = {}) {
  return {
    before: {
      all: [
        hooks.authenticate('jwt', options.auth),
        cache(options.cache)
      ],
      create: [
        disallow('external'),
      ],
      update: [
        disallow('external'),
        hooks.discardFields('createdAt', 'updatedAt')
      ],
      patch: [
        disallow('external'),
        hooks.discardFields('createdAt', 'updatedAt')
      ],
      remove: [
        disallow('external')
      ]
    },
    after: {
      all: [
        hooks.populate('creator', { service: 'users' }),
        hooks.populate('subject', { keepOrig: true }), // typed id
        hooks.populate('user', { service: 'user-groups' }),
        cache(options.cache),
        hooks.presentEntity(PermissionEntity, options.entities),
        hooks.responder()
      ]
    }
  };
}