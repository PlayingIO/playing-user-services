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
