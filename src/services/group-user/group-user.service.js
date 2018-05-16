import assert from 'assert';
import makeDebug from 'debug';
import fp from 'mostly-func';
import path from 'path';
import { plural } from 'pluralize';

import defaultHooks from './group-users.hooks';

const debug = makeDebug('playing:user-services:groups/users');

const defaultOptions = {
  name: 'groups/users'
};

export class GroupUserService {
  constructor (options) {
    this.options = fp.assignAll(defaultOptions, options);
    this.name = this.options.name;
  }

  setup (app) {
    this.app = app;
    this.hooks(defaultHooks(this.options));
  }
}

export default function init (app, options, hooks) {
  return new GroupUserService(options);
}

init.Service = GroupUserService;
