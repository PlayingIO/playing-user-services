import { hooks as auth } from 'feathers-authentication';
import { hooks } from 'mostly-feathers-mongoose';
import RoleEntity from '~/entities/role-entity';

module.exports = {
  before: {
    all: [
      auth.authenticate('jwt')
    ]
  },
  after: {
    all: [
      hooks.presentEntity(RoleEntity),
      hooks.responder()
    ]
  }
};
