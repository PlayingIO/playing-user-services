import assert from 'assert';
import { Service, createService } from 'mostly-feathers-mongoose';
import fp from 'mostly-func';

import GroupModel from '../../models/group.model';
import defaultHooks from './group.hooks';

const defaultOptions = {
  name: 'groups'
};

export class GroupService extends Service {
  constructor (options) {
    options = fp.assign(defaultOptions, options);
    super(options);
  }

  setup (app) {
    super.setup(app);
    this.hooks(defaultHooks(this.options));

    // administrator group
    this.get(null, {
      query: { groupname: 'administrators' }
    }).then(result => {
      if (!result) {
        return this.create({
          groupname: 'administrators',
          label: 'Administrators Group',
          description: 'Group of users with administrative rights'
        });
      }
    }).catch(console.error);
  }

  create (data, params) {
    return super.create(data, params);
  }

  update (id, data, params) {
    return super.update(id, data, params);
  }

  patch (id, data, params) {
    return super.patch(id, data, params);
  }

  remove (id, params) {
    return super.remove(id, params);
  }

  // nested groups
  groups (id, data, params, original) {
    params.query = params.query || {};
    params.query.parent = original.id;
    return this.find(params);
  }

  users (id, data, params, original) {
    params = { query: {}, ...params };
    params.query.groups = {
      $elemMatch: { group: original.id }
    };
    const svcUsers = this.app.service('users');
    return svcUsers.find(params);
  }
}

export default function init (app, options, hooks) {
  options = { ModelName: 'group', ...options };
  return createService(app, GroupService, GroupModel, options);
}

init.Service = GroupService;
