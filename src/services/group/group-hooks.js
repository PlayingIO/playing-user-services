import { hooks as auth } from 'feathers-authentication';
import { hooks } from 'mostly-feathers-mongoose';
import GroupEntity from '~/entities/group-entity';

module.exports = {
  before: {
    all: [
      auth.authenticate('jwt')
    ]
  },
  after: {
    all: [
      hooks.presentEntity(GroupEntity),
      hooks.responder()
    ]
  }
};
