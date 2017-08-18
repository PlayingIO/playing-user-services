import { Service, createService } from 'mostly-feathers-mongoose';
import GroupModel from '~/models/group-model';
import defaultHooks from './group-hooks';

const defaultOptions = {
  name: 'groups'
};

class GroupService extends Service {
  constructor(options) {
    options = Object.assign({}, defaultOptions, options);
    super(options);
  }

  setup(app) {
    super.setup(app);
    this.hooks(defaultHooks(this.options));
  }

  groups(id, data, params, orignal) {
    return []; // sub groups
  }

  users(id, data, params, orignal) {
    params.query = params.query || {};
    params.query.groups = orignal.id;
    const users = this.app.service('users');
    return users.find(params); // with provider
  }
}

export default function init(app, options, hooks) {
  options = Object.assign({ ModelName: 'group' }, options);
  return createService(app, GroupService, GroupModel, options);
}

init.Service = GroupService;
