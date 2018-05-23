import assert from 'assert';
import makeDebug from 'debug';
import fp from 'mostly-func';

import defaultHooks from './user-group.hooks';

const debug = makeDebug('playing:user-services:users/groups');

const defaultOptions = {
  name: 'users/groups'
};

// parse roles struct like { role: bool }
const parseRoles = (roles) => {
  if (fp.isString(roles)) return { [roles]: true };
  if (fp.isArray(roles)) return fp.map(role => ({ [role]: true }), roles);
  if (fp.isObject(roles)) return fp.map(fp.parseBool, roles);
  return roles;
};

const filterGroupRoles = (group, roles, bool) => {
  return fp.map(
    role => ({ group, role }),
    fp.keys(fp.filter(fp.equals(bool), roles))
  );
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
    const roles = parseRoles(data.roles || data.role);

    const svcUsers = this.app.service('users');
    const groups = filterGroupRoles(data.group, roles, true);
    const result = await svcUsers.patch(target.id, {
      $addToSet: {
        groups: { $each: groups }
      }
    });
    return result && result.groups;
  }

  /**
   * Update group with roles for target user
   */
  async update (data, params) {
    const target = params.primary;
    assert(target, 'target user is not exists');
    assert(data.group, 'data.group is not privided');
    assert(data.roles, 'data.role(s) is not provided');
    const roles = parseRoles(data.roles || data.role);

    const svcUsers = this.app.service('users');
    const groups = filterGroupRoles(data.group, roles, true);
    const removes = filterGroupRoles(data.group, roles, false);
    const result = await svcUsers.patch(target.id, {
      $addToSet: {
        groups: { $each: groups }
      },
      $pull: {
        groups: {
          group: data.group,
          role: { $in: fp.keys(fp.map(fp.prop('role'), removes)) }
        }
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
