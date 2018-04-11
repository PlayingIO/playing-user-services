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

export class PermissionService extends Service {
  constructor (options) {
    options = Object.assign({}, defaultOptions, options);
    super(options);
  }

  setup (app) {
    super.setup(app);
    this.hooks(defaultHooks(this.options));
  }

  create (data, params) {
    assert(data.actions, 'data.actions not provided.');
    assert(data.subject, 'data.subject not provided.');
    assert(data.user, 'data.user not provided.');
    data.actions = fp.is(Array, data.actions)? data.actions : [data.actions];

    return super.upsert(null, data, { query: {
      actions: { $all: data.actions },
      subject: data.subject,
      user: data.user,
      role: data.role,
      conditions: data.conditions || {}
    }});
  }

  remove (id, params) {
    if (id) {
      return super.remove(id, params);
    } else {
      params = fp.assign({ query: {} }, params);
      assert(params.query.actions, 'params.query.actions is not provided.');
      assert(params.query.subject, 'params.query.subject is not provided.');
      if (!fp.is(Array, params.query.actions)) {
        params.query.actions = [params.query.actions];
      }

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
  options = Object.assign({ ModelName: 'user-permission' }, options);
  return createService(app, PermissionService, LeaderboardModel, options);
}

init.Service = PermissionService;
