import { Service, createService } from 'mostly-feathers-mongoose';
import fp from 'ramda';
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

  _addUser(group, users) {
    const service = this.app.service('users');
    const addGroups = fp.map(user =>
      service.action('patch', 'addGroup', user, { group: group.id }));
    return Promise.all(addGroups(users))
      .then(() => group);
  }

  create(data, params) {
    return super.create(data, params).then(group => {
      if (data.user || data.users) {
        return this._addUser(group, [].concat(data.user || data.users))
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
    return super.update(data, params).then(group => {
      if (data.user || data.users) {
        return this._addUser(group, [].concat(data.user || data.users));
      }
      return group;
    });
  }

  patch(id, data, params) {
    return super.patch(data, params).then(group => {
      if (data.user || data.users) {
        return this._addUser(group, [].concat(data.user || data.users));
      }
      return group;
    });
  }

  addUser(id, data, params, orignal) {
    assert(data.user || data.users, 'data.user not provided');
    return this._addUser(orignal, [].concat(data.user || data.users));
  }

  groups(id, data, params, orignal) {
    params.query = params.query || {};
    params.query.parent = orignal.id;
    return this.find(params); // with provider
  }

  users(id, data, params, orignal) {
    params.query = params.query || {};
    params.query.groups = orignal.id;
    const users = this.app.service('users');
    return users.find(params); // with provider
  }
}

export default function init(app, options, hooks) {
  options = Object.assign({ ModelName: 'group' }, options);
  return createService(app, GroupService, GroupModel, options);
}

init.Service = GroupService;
