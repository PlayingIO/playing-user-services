import { plugins } from 'mostly-feathers-mongoose';
import random from 'mongoose-random';

const options = {
  timestamps: true
};

/*
 * A "user" belongs to some "groups"
 * "roles" are assigned to a user to grant the permissions
 */
const fields = {
  email: { type: String, unique: true, sparse: true },      // credential email
  mobile: { type: String, unique: true, sparse: true },     // credential mobile
  username: { type: String, unique: true, required: true }, // credential username
  nickname: { type: String },              // display name
  firstName: { type: String },             // real name
  lastName: { type: String },              // real name
  password: { type: String, required: true },
  avatar: { type: 'Mixed' },               // blob schema

  groups: [{
    group: { type: 'ObjectId' },           // group id
    myroles: [{ type: 'String' }]          // my roles in this group
  }],

  city: { type: String },
  company: { type: String },
  birthday: { type: Date },
  gender: { type: String, enum: ['MALE', 'FEMALE', 'UNKNOWN'], default: 'MALE' },
  intro: { type: String, default: '' },
  status: { type: Number, default: 0 },
  isAdministrator: { type: Boolean },      // admin account

  alerts: { type: 'Mixed' },               // last read time of each kind of alerts
                                           // e.g. { <alertId>: new Date() }
  devices: {
    android: { type: Array, default: undefined }, // android
    ios: { type: Array, default: undefined },     // iphone
    web: { type: Array, default: undefined },     // web browser
    last: { type: 'Mixed' },               // last device
    invited: { type: 'Mixed' },            // device being invitated
  },
  preferences: { type: 'Mixed' },          // preferences
  invites: { type: 'Mixed' },              // invitation
  socials: {
    wechat: { type: 'Mixed' },             // wechat binding info
    facebook: { type: 'Mixed' },           // facebook binding info
    google: { type: 'Mixed' },             // google binding info
    github: { type: 'Mixed' },             // github binding info
  },
  statistics: { type: 'Mixed' },
};

export default function model (app, name) {
  const mongoose = app.get('mongoose');
  const schema = new mongoose.Schema(fields, options);
  schema.plugin(random);
  schema.plugin(plugins.softDelete);
  return mongoose.model(name, schema);
}

model.schema = fields;