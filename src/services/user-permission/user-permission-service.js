import assert from 'assert';
import makeDebug from 'debug';
import { Service, helpers, createService } from 'mostly-feathers-mongoose';
import fp from 'mostly-func';
import LeaderboardModel from '~/models/user-permission-model';
import defaultHooks from './user-permission-hooks';

const debug = makeDebug('playing:interaction-services:user-permissions');

const defaultOptions = {
  name: 'user-permissions'
};

class PermissionService extends Service {
  constructor(options) {
    options = Object.assign({}, defaultOptions, options);
    super(options);
  }

  setup(app) {
    super.setup(app);
    this.hooks(defaultHooks(this.options));
  }

  create(data, params) {
    assert(data.actions, 'data.actions not provided.');
    assert(data.subject, 'data.subject not provided.');
    assert(data.user, 'data.user not provided.');
    data.actions = fp.is(Array, data.actions)? data.actions : [data.actions];

    return super._upsert(null, data, { query: {
      actions: { $all: data.actions },
      subject: data.subject,
      user: data.user,
      conditions: data.conditions || {}
    }});
  }
}

export default function init(app, options, hooks) {
  options = Object.assign({ ModelName: 'user-permission' }, options);
  return createService(app, PermissionService, LeaderboardModel, options);
}

init.Service = PermissionService;
