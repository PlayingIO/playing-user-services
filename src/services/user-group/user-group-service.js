import moment from 'moment';
import { Service, createService } from 'mostly-feathers-mongoose';
import fp from 'ramda';
import GroupModel from '~/models/group-model';
import defaultHooks from './user-group-hooks';

const defaultOptions = {
  name: 'user-groups'
};

class UserGroupService {
  constructor(options) {
    this.options = Object.assign({}, defaultOptions, options);
  }

  setup(app) {
    this.app = app;
    this.hooks(defaultHooks(this.options));
  }

  // latest users & groups
  find(params) {
    const users = this.app.service('users');
    const groups = this.app.service('groups');
    params.query.$limit = params.query.$limit || 2;
    return Promise.all([
      users.find(params),
      groups.find(params)
    ]).then(([latestusers, latestGroups]) => {
      const sortByCreatedAt = fp.sort((a, b) => moment(a.createdAt).diff(b.createdAt));
      let results = fp.concat(
        fp.map(fp.assoc('type', 'user'), latestusers.data),
        fp.map(fp.assoc('type', 'group'), latestGroups.data),
      );
      return sortByCreatedAt(results);
    });
  }
}

export default function init(app, options, hooks) {
  return new UserGroupService(options);
}

init.Service = UserGroupService;
