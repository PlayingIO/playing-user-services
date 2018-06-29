import assert from 'assert';
import makeDebug from 'debug';
import fp from 'mostly-func';

import defaultHooks from './user-invite.hooks';

const debug = makeDebug('playing:user-services:users/invites');

const defaultOptions = {
  name: 'users/invites'
};

export class UserInviteService {
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

export default function init (app, options, hooks) {
  return new UserInviteService(options);
}

init.Service = UserInviteService;
