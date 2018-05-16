import assert from 'assert';
import makeDebug from 'debug';
import fp from 'mostly-func';

import defaultHooks from './user-group.hooks';

const debug = makeDebug('playing:user-services:users/groups');

const defaultOptions = {
  name: 'users/groups'
};

export class UserGroupService {
  constructor (options) {
    this.options = fp.assignAll(defaultOptions, options);
    this.name = this.options.name;
  }

  setup (app) {
    this.app = app;
    this.hooks(defaultHooks(this.options));
  }

  /**
   * Add group/role to target user
   */
  async create (data, params) {
    const target = params.target;
    assert(target, 'target user is not exists');
    assert(data.group, 'data.group is not privided');
    assert(data.role, 'data.role is not provided');

    const svcUsers = this.app.service('users');
    const result = await svcUsers.patch(target.id, {
      $addToSet: {
        groups: { group: data.group, role: data.role }
      }
    });
    return result && result.groups;
  }

  /**
   * Remove group/role from target user
   */
  async remove (id, params) {
    const target = params.target;
    assert(target, 'target user is not exists');
    assert(params.query.group, 'params.query.group is not privided');
    assert(params.query.role, 'params.query.role is not privided');

    const svcUsers = this.app.service('users');
    const result = await svcUsers.patch(target.id, {
      $pull: {
        groups: { group: params.query.group, role: params.query.role }
      }
    });
    return result && result.groups;
  }
}

export default function init (app, options, hooks) {
  return new UserGroupService(options);
}

init.Service = UserGroupService;
