import assert from 'assert';
import bcrypt from 'bcryptjs';
import { Service, helpers, createService } from 'mostly-feathers-mongoose';
import fp from 'mostly-func';

import UserModel from '../../models/user.model';
import defaultHooks from './user.hooks';

const defaultOptions = {
  name: 'users'
};

export class UserService extends Service {
  constructor (options) {
    options = fp.assignAll(defaultOptions, options);
    super(options);
  }

  setup (app) {
    super.setup(app);
    this.hooks(defaultHooks (this.options));

    // administrator account
    this.first({
      query: { username: 'admin' }
    }).then(result => {
      if (!result) {
        return this.create({
          username: 'admin',
          password: 'admin',
          nickname: 'Admin',
          email: 'admin@playingio.com',
          company: 'PlayingIO'
        });
      }
    }).catch(console.error);
  }

  create (data, params) {
    return super.create (data, params);
  }

  find (params) {
    params = { query: {}, ...params };
    if (params.password === true) {
      params.query.$select = helpers.addToSelect(params.query.$select || [], 'password');
    }
    return super.find(params);
  }

  get (id, params) {
    params = { query: {}, ...params };
    if (params.password === true) {
      params.query.$select = helpers.addToSelect(params.query.$select || [], 'password');
    }
    return super.get(id, params);
  }

  update (id, data, params) {
    return super.update(id, data, params);
  }

  patch (id, data, params) {
    return super.patch(id, data, params);
  }

  invite (id, data, params) {
    assert(data.user, 'data.user is not privided');
    // TODO invite user
    return data.user;
  }

  addGroup (id, data, params, original) {
    assert(data.group, 'data.group is not privided');
    assert(data.role, 'data.role is not provided');
    return super.patch(id, {
      $addToSet: {
        groups: { group: data.group, role: data.role }
      }
    }, params);
  }

  addGroups (id, data, params, original) {
    assert(fp.isArray(data), 'data should be an array of group/role');
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

  removeGroup (id, data, params, original) {
    assert(data.group, 'data.group is not privided');
    assert(data.role, 'data.role is not privided');
    return super.patch(id, {
      $pull: {
        groups: { group: data.group, role: data.role }
      }
    }, params);
  }

  removeGroups (id, data, params, original) {
    assert(fp.isArray(data), 'data should be an array of group/role');
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

  changePassword (id, data, params, user) {
    assert(bcrypt.compareSync(data.password, user.password), 'Old password incorrect');
    return this.patch(id, { password: data.passwordNew }, params);
  }
}

export default function init (app, options, hooks) {
  options = { ModelName: 'user', ...options };
  return createService(app, UserService, UserModel, options);
}

init.Service = UserService;
