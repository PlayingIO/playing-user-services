const dateFn = require('date-fns');
const { Service, createService } = require('mostly-feathers-mongoose');
const fp = require('mostly-func');

const GroupModel = require('../../models/group.model');
const defaultHooks = require('./user-search.hooks');

const defaultOptions = {
  name: 'user-searches'
};

class UserSearchService {
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

    const type = params.query.type || 'user-group';
    const getLatestUsers = (type === 'user' || type === 'user-group')
      ? svcUsers.find(dissocTerm('username')(params))
      : Promise.resolve();
    const getLatestGroups = (type === 'group' || type === 'user-group')
      ? svcGroups.find(dissocTerm('groupname')(params))
      : Promise.resolve();
    const [latestUsers, latestGroups] = await Promise.all([
      getLatestUsers,
      getLatestGroups,
    ]);
    const sortByCreatedAt = fp.sort((a, b) =>
      dateFn.compareDesc(a.createdAt, b.createdAt));
    const data = fp.concat(
      fp.propOf('data', latestUsers) || [],
      fp.propOf('data', latestGroups) || []
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

module.exports = function init (app, options, hooks) {
  return new UserSearchService(options);
};
module.exports.Service = UserSearchService;
