import moment from 'moment';
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
    params.query.$limit = params.query.$limit || 2;

    const users = this.app.service('users');
    const groups = this.app.service('groups');
    const dissocTerm = term => params => {
      let query = fp.dissoc('type', params.query);
      if (query.term) {
        query = fp.assoc(term, query.term, query);
        query = fp.dissoc('term', query);
      }
      return fp.assoc('query', query, params);
    };

    let promises = {};
    if (!params.query.type || params.query.type === 'user' || params.query.type === 'user-group') {
      promises.latestUsers = users.find(dissocTerm('username')(params));
    }
    if (!params.query.type || params.query.type === 'group' || params.query.type === 'user-group') {
      promises.latestGroups = groups.find(dissocTerm('groupname')(params));
    }
    return Promise.props(promises).then((results) => {
      const sortByCreatedAt = fp.sort((a, b) => moment(a.createdAt).diff(b.createdAt) * -1);
      const dataOf = fp.propOr([], 'data');
      const data = fp.concat(
        fp.propOr([], 'data', results.latestUsers),
        fp.propOr([], 'data', results.latestGroups)
      );
      return sortByCreatedAt(data);
    });
  }
}

export default function init(app, options, hooks) {
  return new UserGroupService(options);
}

init.Service = UserGroupService;
