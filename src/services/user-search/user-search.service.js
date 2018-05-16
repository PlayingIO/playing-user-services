import dateFn from 'date-fns';
import { Service, createService } from 'mostly-feathers-mongoose';
import fp from 'mostly-func';

import GroupModel from '../../models/group.model';
import defaultHooks from './user-search.hooks';

const defaultOptions = {
  name: 'user-search'
};

export class UserSearchService {
  constructor (options) {
    this.options = fp.assignAll(defaultOptions, options);
  }

  setup (app) {
    this.app = app;
    this.hooks(defaultHooks(this.options));
  }

  /**
   * Find latest users & groups or search by term
   */
  async find (params) {
    params = { query: {}, ...params };

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

    const type = params.query.type;
    const getLatestUsers = (type === 'user' || !type)
      ? svcUsers.find(dissocTerm('username')(params))
      : Promise.resolve();
    const getLatestGroups = (type === 'group' || !type)
      ? svcGroups.find(dissocTerm('groupname')(params))
      : Promise.resolve();
    const [latestUsers, latestGroups] = await Promise.all([
      getLatestUsers,
      getLatestGroups,
    ]);
    const sortByCreatedAt = fp.sort((a, b) =>
      dateFn.compareDesc(a.createdAt, b.createdAt));
    const data = fp.concat(
      latestUsers && latestUsers.data || latestUsers || [],
      latestGroups && latestGroups.data || latestGroups || []
    );
    return sortByCreatedAt(data);
  }

  /**
   * Get user or group by id
   */
  async get (id, params) {
    params = { query: {}, ...params };

    params.query.id = id;
    params.query.$limit = 1;
    params.paginate = false;

    const [users, groups] = await Promise.all([
      this.app.service('users').find(id, params),
      this.app.service('groups').find(id, params)
    ]);
    if (users && users.length > 0) return users[0];
    if (groups && groups.length > 0) return groups[0];
    return null;
  }
}

export default function init (app, options, hooks) {
  return new UserSearchService(options);
}

init.Service = UserSearchService;
