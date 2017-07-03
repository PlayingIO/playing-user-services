import assert from 'assert';
import bcrypt from 'bcryptjs';
import { Service, createService } from 'mostly-feathers-mongoose';
import UserModel from '~/models/user-model';
import defaultHooks from './user-hooks';

const defaultOptions = {
  id: 'id', // service.id for authentication
  name: 'user-service'
};

class UserService extends Service {
  constructor(options) {
    options = Object.assign({}, defaultOptions, options);
    super(options);
  }

  setup(app) {
    super.setup(app);
    this.hooks(defaultHooks);
  }

  changePassword(id, data, params, user) {
    assert(bcrypt.compareSync(data.password, user.password), 'Old password incorrect');
    return this.patch(id, { password: data.passwordNew }, params);
  }
}

export default function init(app, options, hooks) {
  options = Object.assign({ ModelName: 'user' }, options);
  return createService(app, UserService, UserModel, options);
}

init.Service = UserService;
