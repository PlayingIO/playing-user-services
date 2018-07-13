const { plugins } = require('mostly-feathers-mongoose');
const random = require('mongoose-random');

const options = {
  timestamps: true,
  discriminatorKey: 'type',
};

/**
 * A "user" belongs to some "groups" with certain toles
 */
const fields = {
  email: { type: String, unique: true, sparse: true },      // credential email
  mobile: { type: String, unique: true, sparse: true },     // credential mobile
  username: { type: String, unique: true, required: true }, // credential username
  nickname: { type: String },              // display name
  firstName: { type: String },             // real name
  lastName: { type: String },              // real name
  password: { type: String, required: true, select: false },
  type: { type: String, default: 'user' }, // discriminator key
  avatar: { type: 'Mixed' },               // blob schema

  // group/role pairs, not mixed type for indexing by groups.group
  groups: [{
    _id: false,
    group: { type: 'ObjectId', required: true },
    role: { type: 'String' }
  }],

  city: { type: String },
  company: { type: String },
  birthday: { type: Date },
  gender: { type: String, enum: ['MALE', 'FEMALE', 'UNKNOWN'], default: 'MALE' },
  intro: { type: String, default: '' },
  status: { type: Number, default: 0 },
  isAdministrator: { type: Boolean },      // admin account

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

module.exports = function model (app, name) {
  const mongoose = app.get('mongoose');
  const schema = new mongoose.Schema(fields, options);
  schema.plugin(random);
  schema.plugin(plugins.trashable);
  schema.index({ email: 1, mobile: 1, username: 1, type: 1 });
  schema.index({ 'groups.group': 1 });
  return mongoose.model(name, schema);
};
module.exports.schema = fields;