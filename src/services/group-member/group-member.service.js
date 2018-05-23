import assert from 'assert';
import makeDebug from 'debug';
import fp from 'mostly-func';

import defaultHooks from './group-member.hooks';

const debug = makeDebug('playing:user-services:groups/members');

const defaultOptions = {
  name: 'groups/members'
};

export class GroupMemberService {
  constructor (options) {
    this.options = fp.assignAll(defaultOptions, options);
    this.name = this.options.name;
  }

  setup (app) {
    this.app = app;
    this.hooks(defaultHooks(this.options));
  }

  /**
   * find members of target group
   */
  async find (params) {
    params = { query: {}, ...params };
    const group = params.primary;
    assert(group, 'target group is not exists');
    params.query.groups = {
      $elemMatch: { group: group.id }
    };
    const svcUsers = this.app.service('users');
    return svcUsers.find(params);
  }
}

export default function init (app, options, hooks) {
  return new GroupMemberService(options);
}

init.Service = GroupMemberService;