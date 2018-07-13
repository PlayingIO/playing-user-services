const assert = require('assert');
const makeDebug = require('debug');
const fp = require('mostly-func');

const defaultHooks = require('./user-invite.hooks');

const debug = makeDebug('playing:user-services:users/invites');

const defaultOptions = {
  name: 'users/invites'
};

class UserInviteService {
  constructor (options) {
    this.options = fp.assignAll(defaultOptions, options);
    this.name = this.options.name;
  }

  setup (app) {
    this.app = app;
    this.hooks(defaultHooks(this.options));
  }

  /**
   * Find invites of current user
   */
  async find (params) {
    return [];
  }

  /**
   * Invite user to register
   */
  async create (data, params) {
    assert(data.user, 'user is not privided');
    // TODO invite user
    return data.user;
  }
}

module.exports = function init (app, options, hooks) {
  return new UserInviteService(options);
};
module.exports.Service = UserInviteService;
