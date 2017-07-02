import { Service, createService } from 'mostly-feathers-mongoose';
import GroupModel from '~/models/group-model';
import defaultHooks from './group-hooks';

const defaultOptions = {
  name: 'group-service'
};

class GroupService extends Service {
  constructor(options) {
    options = Object.assign({}, defaultOptions, options);
    super(options);
  }

  setup(app) {
    super.setup(app);
    this.hooks(defaultHooks);
  }
}

export default function init(app, options, hooks) {
  options = Object.assign({ ModelName: 'group' }, options);
  return createService(app, GroupService, GroupModel, options);
}

init.Service = GroupService;
