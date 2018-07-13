const assert = require('assert');
const makeDebug = require('debug');
const { Service, createService } = require('mostly-feathers-mongoose');
const fp = require('mostly-func');

const LeaderboardModel = require('../../models/user-permission.model');
const defaultHooks = require('./user-permission.hooks');

const debug = makeDebug('playing:user-services:user-permissions');

const defaultOptions = {
  name: 'user-permissions'
};

class UserPermissionService extends Service {
  constructor (options) {
    options = fp.assignAll(defaultOptions, options);
    super(options);
  }

  setup (app) {
    super.setup(app);
    this.hooks(defaultHooks(this.options));
  }

  async create (data, params) {
    assert(data.actions, 'actions not provided.');
    assert(data.subject, 'subject not provided.');
    assert(data.user, 'user not provided.');
    data.actions = fp.asArray(data.actions);

    // workaround for upsert with $all query errors
    // https://jira.mongodb.org/browse/SERVER-3946
    const elemMatchAll = fp.map(action => {
      return { $elemMatch: { $eq: action } };
    }, data.actions);
    return super.upsert(null, data, { query: {
      actions: { $all: elemMatchAll },
      subject: data.subject,
      user: data.user,
      role: data.role
    }});
  }

  async remove (id, params) {
    if (id) {
      return super.remove(id, params);
    } else {
      params = { query: {}, ...params };
      assert(params.query.actions, 'query.actions is not provided.');
      assert(params.query.subject, 'query.subject is not provided.');
      params.query.actions = fp.asArray(params.query.actions);

      let query = {
        actions: { $all: params.query.actions },
        subject: params.query.subject
      };
      if (params.query.user) query.user = params.query.user;
      if (params.query.role) query.role = params.query.role;
      const multi = fp.isNil(params.$multi)? true : params.$multi;

      return super.remove(null, { query, $multi: multi });
    }
  }
}

module.exports = function init (app, options, hooks) {
  options = { ModelName: 'user-permission', ...options };
  return createService(app, UserPermissionService, LeaderboardModel, options);
};
module.exports.Service = UserPermissionService;
