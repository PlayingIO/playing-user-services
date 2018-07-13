const assert = require('assert');
const makeDebug = require('debug');
const fp = require('mostly-func');

const defaultHooks = require('./group-subgroup.hooks');

const debug = makeDebug('playing:user-services:groups/subgroups');

const defaultOptions = {
  name: 'groups/subgroups'
};

class GroupSubgroupService {
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
    const target = params.primary;
    assert(target, 'target group is not exists');
    params.query.parent = target.id;

    const svcGroups = this.app.service('groups');
    return svcGroups.find(params);
  }
}

module.exports = function init (app, options, hooks) {
  return new GroupSubgroupService(options);
};
module.exports.Service = GroupSubgroupService;
