import assert from 'assert';
import bcrypt from 'bcryptjs';
import { Service, createService } from 'mostly-feathers-mongoose';
import fp from 'mostly-func';

import UserModel from '~/models/user-model';
import defaultHooks from './user-hooks';

const defaultOptions = {
  name: 'users'
};

class UserService extends Service {
  constructor(options) {
    options = Object.assign({}, defaultOptions, options);
    super(options);
  }

  setup(app) {
    super.setup(app);
    this.hooks(defaultHooks(this.options));
  }

  _invite(id, data, params) {
    assert(data.user, 'data.user not privided');
    // TODO invite user
    return data.user;
  }

  _addGroup(id, data, params, original) {
    assert(data.group || data.groups, 'data.group not privided');
    const groups = data.groups || [data.group];
    return super.patch(id, {
      $addToSet: {
        groups: { $each: groups }
      }
    }, params);
  }

  _removeGroup(id, data, params, original) {
    assert(data.group || data.groups, 'data.group not privided');
    const groups = data.groups || [data.group];
    return super.patch(id, {
      $pull: {
        groups: { $in: groups }
      }
    }, params);
  }

  _changePassword(id, data, params, user) {
    assert(bcrypt.compareSync(data.password, user.password), 'Old password incorrect');
    return this.patch(id, { password: data.passwordNew }, params);
  }
}

export default function init(app, options, hooks) {
  options = Object.assign({ ModelName: 'user' }, options);
  return createService(app, UserService, UserModel, options);
}

init.Service = UserService;
