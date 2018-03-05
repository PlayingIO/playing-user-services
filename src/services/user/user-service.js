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

  create(data, params) {
    return super.create(data, params);
  }

  update(id, data, params) {
    return super.update(id, data, params);
  }

  patch(id, data, params) {
    return super.patch(id, data, params);
  }

  _invite(id, data, params) {
    assert(data.user, 'data.user is not privided');
    // TODO invite user
    return data.user;
  }

  _addGroup(id, data, params, original) {
    assert(data.group, 'data.group is not privided');
    assert(data.role, 'data.role is not provided');
    return super.patch(id, {
      $addToSet: {
        groups: { group: data.group, role: data.role }
      }
    }, params);
  }

  _addGroups(id, data, params, original) {
    assert(fp.is(Array, data), 'data should be an array of group/role');
    const groups = fp.map(pair => {
      assert(pair.group, 'array.group is not privided');
      assert(pair.role, 'array.role is not provided');
      return { group: pair.group, role: pair.role };
    }, data);
    return super.patch(id, {
      $addToSet: {
        groups: { $each: groups }
      }
    }, params);
  }

  _removeGroup(id, data, params, original) {
    assert(data.group, 'data.group is not privided');
    assert(data.role, 'data.role is not privided');
    return super.patch(id, {
      $pull: {
        groups: { group: data.group, role: data.role }
      }
    }, params);
  }

  _removeGroups(id, data, params, original) {
    assert(fp.is(Array, data), 'data should be an array of group/role');
    const groups = fp.map(pair => {
      assert(pair.group, 'array.group is not privided');
      assert(pair.role, 'array.role is not provided');
      return { group: pair.group, role: pair.role };
    }, data);
    return super.patch(id, {
      $pullAll: {
        groups: groups
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
