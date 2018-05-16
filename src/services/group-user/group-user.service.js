import assert from 'assert';
import makeDebug from 'debug';
import fp from 'mostly-func';

import defaultHooks from './group-user.hooks';

const debug = makeDebug('playing:user-services:groups/users');

const defaultOptions = {
  name: 'groups/users'
};

export class GroupUserService {
  constructor (options) {
    this.options = fp.assignAll(defaultOptions, options);
    this.name = this.options.name;
  }

  setup (app) {
    this.app = app;
    this.hooks(defaultHooks(this.options));
  }

  /**
   * find users of target group
   */
  async find (params) {
    params = { query: {}, ...params };
    const target = params.target;
    assert(target, 'target group is not exists');
    params.query.groups = {
      $elemMatch: { group: target.id }
    };
    const svcUsers = this.app.service('users');
    return svcUsers.find(params);
  }
}

export default function init (app, options, hooks) {
  return new GroupUserService(options);
}

init.Service = GroupUserService;
