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
   * Add group/roles to target user
   */
  async create (data, params) {
    const target = params.primary;
    assert(target, 'target user is not exists');
    assert(data.group, 'data.group is not privided');
    assert(data.role || data.roles, 'data.role(s) is not provided');
    // roles struct like { role: bool }
    const roles = data.roles
      ? fp.map(fp.parseBool, data.roles)
      : { [data.role]: true };

    const svcUsers = this.app.service('users');
    const groups = fp.map(
      role => ({ group: data.group, role: role }),
      fp.keys(fp.filter(fp.equals(true), roles))
    );
    const result = await svcUsers.patch(target.id, {
      $addToSet: {
        groups: { $each: groups }
      }
    });
    return result && result.groups;
  }

  /**
   * Remove group from target user
   */
  async remove (id, params) {
    params = { query: {}, ...params };
    const target = params.primary;
    assert(target, 'target user is not exists');
    assert(params.query.group, 'params.query.group is not privided');

    const svcUsers = this.app.service('users');
    let fieldConds = { group: params.query.group };
    if (params.query.role) fieldConds.role = params.query.role;
    const result = await svcUsers.patch(target.id, {
      $pull: { groups: fieldConds }
    });
    return result && result.groups;
  }
}

export default function init (app, options, hooks) {
  return new UserGroupService(options);
}

init.Service = UserGroupService;
