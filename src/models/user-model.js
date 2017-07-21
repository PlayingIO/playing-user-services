import { plugins } from 'mostly-feathers-mongoose';
import random from 'mongoose-random';
import timestamps from 'mongoose-timestamp';

const fields = {
  username: { type: 'String', unique: true, required: true },
  password: { type: 'String', required: true },
  groups: [{ type: 'ObjectId', ref:'group', default: [] }],
  roles: [{ type: 'ObjectId', ref:'role', default: [] }],
  nickname: { type: 'String' },
  email: { type: 'String', unique: true, sparse: true },
  mobile: { type: 'String', unique: true, sparse: true },
  gender: { type: 'String', enum: ['MALE', 'FEMALE', 'UNKNOWN'], default: 'MALE' },
  avatar: { type: 'ObjectId', ref: 'resource' },
  intro: { type: 'String', default: '' },
  birthday: { type: 'Date' },
  company: { type: 'String' },
  city: { type: 'String' },
  statistics: {
    loginCount: { type: 'Number', default: 0 },
    followersCount: { type: 'Number', default: 0 },
    followeesCount: { type: 'Number', default: 0 },
    browseNum: { type: 'Number', default: 0 },
    bookCount: { type: 'Number', default: 0 },
    letterCount: { type: 'Number', default: 0 },
    albumCount: { type: 'Number', default: 0 },
  },
  socials: {
    wechat: {
      unionId: { type: 'String' },
      nickname: { type: 'String' },
      status: { type: 'Number' }
    },
  },
  alerts: { type: 'Mixed' }, // last read time of each kind of alerts
  // e.g. { <alertId>: new Date() }
  invitation: { type: 'String' }, // invitation
  official: { type: 'Boolean' }, // official account
  status: { type: 'Number', default: 0 },
  extras: {
    lastDeviceUDID: { type: 'String' }, // last device
    invitationDeviceUDID: { type: 'String' }, // device being invitated
  }
};

export default function(app, name) {
  const mongoose = app.get('mongoose');
  const schema = new mongoose.Schema(fields);
  schema.plugin(timestamps);
  schema.plugin(random);
  schema.plugin(plugins.softDelete);
  return mongoose.model(name, schema);
}