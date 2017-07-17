import { Service, createService } from 'mostly-feathers-mongoose';
import RoleModel from '~/models/role-model';
import defaultHooks from './role-hooks';

const defaultOptions = {
  name: 'roles'
};

class RoleService extends Service {
  constructor(options) {
    options = Object.assign({}, defaultOptions, options);
    super(options);
  }

  setup(app) {
    super.setup(app);
    this.hooks(defaultHooks(this.options));
  }
}

export default function init(app, options, hooks) {
  options = Object.assign({ ModelName: 'role' }, options);
  return createService(app, RoleService, RoleModel, options);
}

init.Service = RoleService;
