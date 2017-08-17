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
    params.query.$limit = params.query.$limit || 2;

    const users = this.app.service('users');
    const groups = this.app.service('groups');
    const dissocType = fp.dissocPath(['query', 'type']);

    let promises = {};
    if (!params.query.type || params.query.type === 'user') {
      promises.latestUsers = users.find(dissocType(params));
    }
    if (!params.query.type || params.query.type === 'group') {
      promises.latestGroups = groups.find(dissocType(params));
    }
    return Promise.props(promises).then((results) => {
      const sortByCreatedAt = fp.sort((a, b) => moment(a.createdAt).diff(b.createdAt) * -1);
      const dataOf = fp.propOr([], 'data');
      const data = fp.concat(
        fp.map(fp.assoc('type', 'user'), dataOf(results.latestUsers)),
        fp.map(fp.assoc('type', 'group'), dataOf(results.latestGroups)),
      );
      return sortByCreatedAt(data);
    });
  }
}

export default function init(app, options, hooks) {
  return new UserGroupService(options);
}

init.Service = UserGroupService;
