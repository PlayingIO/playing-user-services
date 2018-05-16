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

  async find (params) {
    params = { query: {}, ...params };
    if (params.password === true) {
      params.query.$select = helpers.addToSelect(params.query.$select || [], 'password');
    }
    return super.find(params);
  }

  async get (id, params) {
    params = { query: {}, ...params };
    if (params.password === true) {
      params.query.$select = helpers.addToSelect(params.query.$select || [], 'password');
    }
    return super.get(id, params);
  }

  /**
   * Change password
   */
  async password (id, data, params) {
    assert(id, 'user id is not provided');
    const user = await this.get(id, { password: true });
    assert(user, 'user is not exists');
    assert(user.password, 'user password is not provided');
    if (bcrypt.compareSync(data.password, user.password)) {
      return this.patch(id, { password: data.passwordNew }, params);
    } else {
      throw new Error('Old password incorrect');
    }
  }
}

export default function init (app, options, hooks) {
  options = { ModelName: 'user', ...options };
  return createService(app, UserService, UserModel, options);
}

init.Service = UserService;
