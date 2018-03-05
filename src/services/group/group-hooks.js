import { hooks as auth } from 'feathers-authentication';
import { hooks } from 'mostly-feathers-mongoose';
import GroupEntity from '~/entities/group-entity';

module.exports = function(options = {}) {
  return {
    before: {
      all: [
        auth.authenticate('jwt')
      ]
    },
    after: {
      all: [
        hooks.assoc('users', { service: 'users', field: 'groups', elemMatch: 'group' }),
        hooks.presentEntity(GroupEntity, options),
        hooks.responder()
      ]
    }
  };
};