const assert = require('assert');
const { Service, createService } = require('mostly-feathers-mongoose');
const fp = require('mostly-func');

const GroupModel = require('../../models/group.model');
const defaultHooks = require('./group.hooks');

const defaultOptions = {
  name: 'groups'
};

class GroupService extends Service {
  constructor (options) {
    options = fp.assignAll(defaultOptions, options);
    super(options);
  }

  setup (app) {
    super.setup(app);
    this.hooks(defaultHooks(this.options));

    // administrator group
    const svcGroups = this.app.service('groups');
    svcGroups.get(null, {
      query: { groupname: 'administrators' }
    }).then(result => {
      if (!result) {
        return svcGroups.create({
          groupname: 'administrators',
          label: 'Administrators Group',
          description: 'Group of users with administrative rights'
        });
      }
    }).catch(console.error);
  }
}

module.exports = function init (app, options, hooks) {
  options = { ModelName: 'group', ...options };
  return createService(app, GroupService, GroupModel, options);
};
module.exports.Service = GroupService;
