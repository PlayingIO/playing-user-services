import assert from 'assert';
import makeDebug from 'debug';
import fp from 'mostly-func';

import defaultHooks from './group-subgroup.hooks';

const debug = makeDebug('playing:user-services:groups/subgroups');

const defaultOptions = {
  name: 'groups/subgroups'
};

export class GroupSubgroupService {
  constructor (options) {
    this.options = fp.assignAll(defaultOptions, options);
    this.name = this.options.name;
  }

  setup (app) {
    this.app = app;
    this.hooks(defaultHooks(this.options));
  }

  /**
   * find nested groups
   */
  async find (params) {
    params = { query: {}, ...params };
    const target = params.target;
    assert(target, 'target group is not exists');
    params.query.parent = target.id;

    const svcGroups = this.app.service('groups');
    return svcGroups.find(params);
  }
}

export default function init (app, options, hooks) {
  return new GroupSubgroupService(options);
}

init.Service = GroupSubgroupService;
