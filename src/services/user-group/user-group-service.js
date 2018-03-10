import dateFn from 'date-fns';
import { Service, createService } from 'mostly-feathers-mongoose';
import fp from 'mostly-func';

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

  // latest users & groups or search by term
  find(params) {
    params = Object.assign({ query: {} }, params);

    const svcUsers = this.app.service('users');
    const svcGroups = this.app.service('groups');

    const dissocTerm = term => params => {
      let query = fp.dissoc('type', params.query);
      if (query.term) {
        query = fp.assoc(term, query.term, query);
        query = fp.dissoc('term', query);
      }
      return fp.assoc('query', query, params);
    };

    let promises = {};
    let type = params && fp.dotPath('query.type', params);
    if (!type || type === 'user' || type === 'user-group') {
      promises.latestUsers = svcUsers.find(dissocTerm('username')(params));
    }
    if (!type || type === 'group' || type === 'user-group') {
      promises.latestGroups = svcGroups.find(dissocTerm('groupname')(params));
    }
    return Promise.props(promises).then((results) => {
      const sortByCreatedAt = fp.sort((a, b) => dateFn.compareDesc(a.createdAt, b.createdAt));
      const dataOf = fp.propOr([], 'data');
      const data = [].concat(
        fp.propOr([], 'data', results.latestUsers),
        fp.propOr([], 'data', results.latestGroups)
      );
      return sortByCreatedAt(data);
    });
  }

  get(id, params) {
    params = Object.assign({ query: {} }, params);

    params.query.id = id;
    params.query.$limit = 1;
    params.paginate = false;

    const findUser = this.app.service('users').find(id, params);
    const findGroup = this.app.service('groups').find(id, params);

    return Promise.all([findUser, findGroup])
      .then(([users, groups]) => {
        if (users && users.length > 0) return users[0];
        if (groups && groups.length > 0) return groups[0];
        return null;
      });
  }
}

export default function init(app, options, hooks) {
  return new UserGroupService(options);
}

init.Service = UserGroupService;
