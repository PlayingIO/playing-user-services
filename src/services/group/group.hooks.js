import { hooks } from 'mostly-feathers-mongoose';
import { cache } from 'mostly-feathers-cache';

import GroupEntity from '../../entities/group.entity';

export default function (options = {}) {
  return {
    before: {
      all: [
        hooks.authenticate('jwt', options.auth),
        cache(options.cache)
      ],
      update: [
        hooks.discardFields('createdAt', 'updatedAt', 'destroyedAt')
      ],
      patch: [
        hooks.discardFields('createdAt', 'updatedAt', 'destroyedAt')
      ]
    },
    after: {
      all: [
        hooks.assoc('members', { service: 'users', field: 'groups', elemMatch: 'group' }),
        hooks.assoc('permissions', { service: 'user-permissions', field: 'user' }),
        hooks.populate('owner', { service: 'users' }),
        cache(options.cache),
        hooks.presentEntity(GroupEntity, options.entities),
        hooks.responder()
      ]
    }
  };
}