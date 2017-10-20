import assert from 'assert';
import { Service, createService } from 'mostly-feathers-mongoose';
import fp from 'mostly-func';

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

  _updateUsers(group, users) {
    const svcUsers = this.app.service('users');
    const ids = fp.map(u => u.id || u);

    const newUsers = ids(users);
    const oldUsers = ids(group.users || []);

    const addUsers = fp.difference(newUsers, oldUsers);
    const removeUsers = fp.difference(oldUsers, newUsers);
    
    const addGroups = fp.map(user =>
      svcUsers.action('addGroup').patch(user, { group: group.id }));
    const removeGroups = fp.map(user =>
      svcUsers.action('removeGroup').patch(user, { group: group.id }));
    
    return Promise.all(fp.concat(
      addGroups(addUsers),
      removeGroups(removeUsers)
    )).then(() => group);
  }

  _getUsers(group, params) {
    params = params || { query: {} };
    params.query.groups = group.id;
    params.paginate = !!params.query.provider; // disable paginate
    const svcUsers = this.app.service('users');
    return svcUsers.find(params); // with provider
  }

  create(data, params) {
    return super.create(data, params).then(group => {
      if (data.user || data.users) {
        return this._updateUsers(group, [].concat(data.user || data.users))
          .catch(err => {
            // rollback and throw
            return super.remove(group.id).then(() => {
              throw err;
            });
          });
      }
      return group;
    });
  }

  update(id, data, params) {
    const dataUsers = data.user || data.users;
    data = fp.dissoc('users', data);
    return super.update(id, data, params).then(group => {
      if (dataUsers) {
        return this._getUsers(group).then(users => {
          group.users = fp.map(fp.prop('id'), users);
          return this._updateUsers(group, [].concat(dataUsers));
        });
      }
      return group;
    });
  }

  patch(id, data, params) {
    const dataUsers = data.user || data.users;
    data = fp.dissoc('users', data);
    return super.patch(id, data, params).then(group => {
      if (dataUsers) {
        return this._getUsers(group).then(users => {
          group.users = fp.map(fp.prop('id'), users);
          return this._updateUsers(group, [].concat(dataUsers));
        });
      }
      return group;
    });
  }

  // nested groups
  _groups(id, data, params, orignal) {
    params.query = params.query || {};
    params.query.parent = orignal.id;
    return this.find(params); // with provider
  }

  _users(id, data, params, orignal) {
    return this._getUsers(orignal, params);
  }
  
}

export default function init(app, options, hooks) {
  options = Object.assign({ ModelName: 'group' }, options);
  return createService(app, GroupService, GroupModel, options);
}

init.Service = GroupService;
