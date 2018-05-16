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
    options = fp.assignAll(defaultOptions, options);
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
}

export default function init (app, options, hooks) {
  options = { ModelName: 'group', ...options };
  return createService(app, GroupService, GroupModel, options);
}

init.Service = GroupService;
