import assert from 'assert';
import bcrypt from 'bcryptjs';
import { Service, createService } from 'mostly-feathers-mongoose';
import fp from 'ramda';

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

  invite(id, data, params) {
    // TODO invite user
    return data;
  }

  addGroup(id, data, params, original) {
    assert(data.group || data.groups, 'data.group not privided');
    const addGroups = fp.pipe(
      fp.map(group => String(group.id || group)),
      fp.concat([data.group] || data.groups),
      fp.uniq
    );
    let groups = addGroups(original.groups || []);
    return super.patch(id, { groups }, params);
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
