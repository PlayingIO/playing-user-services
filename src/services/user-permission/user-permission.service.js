import assert from 'assert';
import makeDebug from 'debug';
import { Service, createService } from 'mostly-feathers-mongoose';
import fp from 'mostly-func';

import LeaderboardModel from '../../models/user-permission.model';
import defaultHooks from './user-permission.hooks';

const debug = makeDebug('playing:user-services:user-permissions');

const defaultOptions = {
  name: 'user-permissions'
};

export class UserPermissionService extends Service {
  constructor (options) {
    options = fp.assignAll(defaultOptions, options);
    super(options);
  }

  setup (app) {
    super.setup(app);
    this.hooks(defaultHooks(this.options));
  }

  async create (data, params) {
    assert(data.actions, 'data.actions not provided.');
    assert(data.subject, 'data.subject not provided.');
    assert(data.user, 'data.user not provided.');
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
      assert(params.query.actions, 'params.query.actions is not provided.');
      assert(params.query.subject, 'params.query.subject is not provided.');
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

export default function init (app, options, hooks) {
  options = { ModelName: 'user-permission', ...options };
  return createService(app, UserPermissionService, LeaderboardModel, options);
}

init.Service = UserPermissionService;
